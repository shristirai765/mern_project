import { Request, Response } from "express";
import AppError from "../utils/appError.utils";
import Product from "../models/product.model";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import mongoose from "mongoose";

const uploadFolder = "/product_picture";

export const createProduct = catchAsync(
    async(req: Request, res: Response)=>{
        const {name, description, brand, price, category} = req.body;
        // const files = req.files as {[fieldname: string]: Express.Multer.File[]};
        const {cover_image, images} = req.files as {
            cover_image: Express.Multer.File[],
            images?: Express.Multer.File[];
        };

        if(!cover_image || !cover_image[0]) throw new AppError("cover image is required", 404);

        if(!name) throw new AppError("name is required", 404);
        if(!description) throw new AppError("description is required", 404);
        if(!brand) throw new AppError("brand is required", 404);
        if(!price) throw new AppError("price is required", 404);
        if(!category) throw new AppError("file is required", 404);


        const existingProduct = await Product.findOne({ name });
        if(existingProduct) throw new AppError("product already exists", 404);

        const category_ref = await mongoose.model("category").findOne({name: 'mobile'});
        if(!category_ref) throw new AppError("Category 'mobile' not found", 404);

        const brand_ref = await mongoose.model("brand").findOne({name: 'Apple'});
        if(!brand_ref) throw new AppError("Brand 'apple' not found", 404);

        const product = new Product({
            name,
            description, 
            brand: brand_ref._id, 
            price, 
            category: category_ref._id
        });

        //* upload cover image
        const{path, public_id} = await upload(cover_image[0], uploadFolder);
        product.cover_image = {
        path,
        public_id
        };

        //* upload images
        if(images && images.length>0){
            const promises = images.map((file)=> upload(file, uploadFolder));
            const files = await Promise.allSettled(promises);
            const fullFilled = files.filter(
                (promise) => promise.status === "fulfilled")
                .map((img)=> img.value);
            //.map((img)=>{
            //     return{
            //         path.img.path,
            //         public_id: img.public_id
            //     }
            // });

            product.set("images", fullFilled);
        }


        await product.save();

        sendResponse(res,{
            message: "product created successfully",
            statusCode: 201,
            data: product,
        });
        // res.status(200).json({
        //     message: "product created successfully",
        //     success: true,
        //     status: "success",
        //     data: product,
        // });
    }
);

export const getAll = catchAsync(
    async (req: Request, res: Response)=>{
        
        const {query} = req.query;
        const filter: Record<string, any> = {};

        if(query){
            filter.$or =[
                {
                    name:{
                        $regex: query,
                        $options: "i",
                    },
                },
                {
                    description:{
                        $regex: query,
                    $options: "i",
                    }
                },
            ];
        }
    const product = await Product.find(filter);

    sendResponse(res,{
            message: "all products fetched",
            statusCode: 200,
            data: product,
        });
    // res.status(200).json({
    //     message: "All products fetched",
    //     success: true,
    //     status: "success",
    //     data: product,
    // });
    }
);

export const getById = catchAsync(
    async (req: Request, res: Response)=>{
        const {id} = req.params;

        const product = await Product.findOne({_id: id});
        if(!product) throw new AppError("Product not found", 404);

        sendResponse(res,{
            message: `Product by ${id} fetched`,
            statusCode: 200,
            data: product,
        });
        // res.status(200).json({
        //     message: `Product by ${id} fetched`,
        //     success: true,
        //     status: "success",
        //     data: product,
        // });
    }
);

export const update = catchAsync(
    async (req: Request, res: Response) => {

        let {
            cover_image,
            images
        } = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const { id } = req.params;
        const {
            name,
            description,
            category,
            brand,
            price,
            new_arrival,
            is_featured,
            deleted_images
        } = req.body;

        const product = await Product.findById(id);

        if (!product) throw new AppError("product not found", 404);

        if (name) product.name = name;
        if (description) product.description = description;
        if (brand) product.brand = brand;
        if (price) product.price = price;
        if (new_arrival) product.new_arrival = new_arrival;
        if (is_featured) product.is_featured = is_featured;
        if (category) product.category = category;

        // Update cover image
        if (cover_image && cover_image[0]) {

            await deleteFile(product.cover_image.public_id);

            const { path, public_id } = await upload(
                cover_image[0],
                uploadFolder
            );

            product.cover_image = {
                path,
                public_id
            };
        }

        // let existingImages = product.images.map(img => ({
        //     path: img.path,
        //     public_id: img.public_id
        // }));
        // Delete selected images
        if (deleted_images && Array.isArray(deleted_images) && deleted_images.length > 0) {

            // for (const img of deleted_images) {
            //     await deleteFile(img.public_id);
            // }

            // existingImages = existingImages.filter((image) => {
            //     return !deleted_images.some((deleted: any) => {
            //         return deleted.public_id === image.public_id;
            //     });
            // });

            Promise.allSettled(
                deleted_images.map((public_id)=> deleteFile(public_id))
            )

            product.images = product.images.filter(
                (img)=> !deleted_images.includes(img.public_id.toString()),
            )as any;
        }

        // Upload newly selected images
        if (images && images.length > 0) {
            const files = await Promise.allSettled(
                images.map((file)=> upload(file, uploadFolder)),
            );
            const newImages = files.filter(
                (file) => file.status === "fulfilled")
                .map((file)=> file.value);
            //.map((img)=>{
            //     return{
            //         path.img.path,
            //         public_id: img.public_id
            //     }
            // });

            product.set("images", [...product.images, ...newImages]);

            // for (const file of uploadedImages) {

            //     const { path, public_id } = await upload(
            //         file,
            //         uploadFolder
            //     );

            //     existingImages.push({
            //         path,
            //         public_id
            //     });
            // }
        }

        // product.set("images",existingImages);

        await product.save();

        sendResponse(res, {
            message: "Product updated",
            statusCode: 200,
            data: product
        });

    }
);

export const remove = catchAsync(
    async (req: Request, res: Response )=>{
        const {id} = req.params;
        const product = await Product.findOne({_id: id});
        if(!product) throw new AppError("product not found", 404);
        
        //* delete cover image
        deleteFile(product.cover_image.public_id);

        //* delete images
        if(product.images && product.images.length > 0){
            Promise.allSettled(product.images.map(img => deleteFile(img.public_id)));
        }

        //* delete
        await product.deleteOne();

        sendResponse(res,{
            message: `product: ${id} deleted`,
            statusCode: 200,
            data: null,
        });
        // res.status(200).json({
        //     message: `Product by ${id} deleted successfully`,
        //     success: true,
        //     status: "success",
        //     data: null
        // });
    }
);

//* get by category
export const getByCategory = catchAsync(
    async (req: Request, res: Response)=>{
        const {categoryId} = req.params;

        const product = await Product.find({category: categoryId});
        if(!product) throw new AppError("Product not found", 404);

        sendResponse(res,{
            message: `Product by ${categoryId} fetched`,
            statusCode: 200,
            data: product,
        });
    }
)

//* get by brand
export const getByBrand = catchAsync(
    async (req: Request, res: Response)=>{
        const {brandId} = req.params;

        const product = await Product.find({brand: brandId});
        if(!product) throw new AppError("Product not found", 404);

        sendResponse(res,{
            message: `Product by ${brandId} fetched`,
            statusCode: 200,
            data: product,
        });
    }
)

//* get new arrivals
export const getNewArrivals = catchAsync(
    async(req: Request, res: Response)=>{
        const new_arrival = await Product.find({new_arrival: true});
        if(new_arrival.length === 0){
            throw new AppError("New arrivals not found", 404);
        }

        sendResponse(res,{
            message: "New arrivals fetched",
            statusCode: 200,
            data: new_arrival,
        });
    }
)

//* get featured
export const getFeatured = catchAsync(
    async(req: Request, res: Response)=>{
        const is_featured = await Product.find({is_featured: true});
        if(is_featured.length === 0){
            throw new AppError("Featured not found", 404);
        }

        sendResponse(res,{
            message: "featured product fetched",
            statusCode: 200,
            data: is_featured,
        });
    }
)
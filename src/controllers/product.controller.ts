import { Request, Response } from "express";
import AppError from "../utils/appError.utils";
import Product from "../models/product.model";
import { upload } from "../utils/cloudinary.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";

const uploadFolder = "/product_picture";

export const createProduct = catchAsync(
    async(req: Request, res: Response)=>{
        const {name, description, brand, price} = req.body;
        const file = req.file;

        if(!file) throw new AppError("file is required", 404);
        if(!name) throw new AppError("name is required", 404);
        if(!description) throw new AppError("description is required", 404);
        if(!brand) throw new AppError("brand is required", 404);
        if(!price) throw new AppError("price is required", 404);

        const existingProduct = await Product.findOne({ name });
        if(existingProduct) throw new AppError("product already exists", 404);

        const product = new Product({name, brand, price});
        const{path, public_id} = await upload(file, uploadFolder);
        product.cover_image = {
        path,
        public_id
        };

        await product.save();

        sendResponse(res,{
            message: "product created successfully",
            statusCode: 200,
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
    const product = await Product.find({});

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
    async (req: Request, res: Response)=>{
        const {id} = req.params;
        const {name, description, brand, price} = req.body;
        
        const updatedProduct = await Product.findByIdAndUpdate({_id: id},{name,description, brand, price});

        if(!updatedProduct) throw new AppError("Product not found", 404);

        sendResponse(res,{
            message: "product updated",
            statusCode: 201,
            data: updatedProduct,
        });
        
        // res.status(200).json({
        //     message: `product by ${id} updated`,
        //     success: true,
        //     status: "success",
        //     data: updatedProduct,
        // });


    }
);

export const remove = catchAsync(
    async (req: Request, res: Response )=>{
        const {id} = req.params;
        const deletedProduct = await Product.findByIdAndDelete({_id: id});
        if(!deletedProduct) throw new AppError("Product not found", 404);

        sendResponse(res,{
            message: "product deleted successfully",
            statusCode: 200,
            data: deletedProduct,
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
        const new_arrival = await Product.find({new_arrival: true}).populate("product");
        if(!new_arrival){
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
        const is_featured = await Product.find({is_featured: true}).populate("product");
        if(!is_featured){
            throw new AppError("Featured not found", 404);
        }

        sendResponse(res,{
            message: "New arrivals fetched",
            statusCode: 200,
            data: is_featured,
        });
    }
)
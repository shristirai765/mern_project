import { Request, Response } from "express";
import AppError from "../utils/appError.utils";
import Product from "../models/product.model";
import { upload } from "../utils/cloudinary.utils";
import { catchAsync } from "../utils/catchAsync.utils";

const uploadFolder = "/product_picture";

export const createProduct = catchAsync(
    async(req: Request, res: Response)=>{
        const {name, brand, price} = req.body;
        const file = req.file;

        if(!file) throw new AppError("file is required", 404);
        if(!name) throw new AppError("name is required", 404);
        if(!brand) throw new AppError("brand is required", 404);
        if(!price) throw new AppError("price is required", 404);

        const existingProduct = await Product.findOne({ name });
        if(existingProduct) throw new AppError("product already exists", 404);

        const product = new Product({name, brand, price});
        const{path, public_id} = await upload(file, uploadFolder);
        product.product_picture = {
        path,
        public_id
        };

        await product.save();

        res.status(200).json({
            message: "product created successfully",
            success: true,
            status: "success",
            data: product,
        });
    }
);

export const getAll = catchAsync(
    async (req: Request, res: Response)=>{
    const product = await Product.find({});

    res.status(200).json({
        message: "All products fetched",
        success: true,
        status: "success",
        data: product,
    });
    }
);

export const getById = catchAsync(
    async (req: Request, res: Response)=>{
        const {id} = req.params;

        const product = await Product.findOne({_id: id});
        if(!product) throw new AppError("Product not found", 404);

        res.status(200).json({
            message: `Product by ${id} fetched`,
            success: true,
            status: "success",
            data: product,
        });
    }
);

export const update = catchAsync(
    async (req: Request, res: Response)=>{
        const {id} = req.params;
        const {name, brand, price} = req.body;
        
        const updatedProduct = await Product.findByIdAndUpdate({_id: id},{name, brand, price});

        if(!updatedProduct) throw new AppError("Product not found", 404);

        res.status(200).json({
            message: `product by ${id} updated`,
            success: true,
            status: "success",
            data: updatedProduct,
        });


    }
);

export const remove = catchAsync(
    async (req: Request, res: Response )=>{
        const {id} = req.params;
        const deletedProduct = await Product.findByIdAndDelete({_id: id});
        if(!deletedProduct) throw new AppError("Product not found", 404);

        res.status(200).json({
            message: `Product by ${id} deleted successfully`,
            success: true,
            status: "success",
            data: null
        });
    }
);
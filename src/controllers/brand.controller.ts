import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import Brand from "../models/brand.model";
import { catchAsync } from "../utils/catchAsync.utils";
import { upload } from "../utils/cloudinary.utils";

const uploadFolder = '/logo';


//* create
export const createBrand = catchAsync(
    async (req: Request, res: Response)=>{
        const {name, description} = req.body;

        const file = req.file;
        if(!file){
            throw new AppError ("file is required", 400);
        }

        if(!name){
            throw new AppError ("name is required", 400);
        }
        if(!description){
            throw new AppError ("description is required", 400);
        }

        const brand = new Brand({name, description});

        const { path, public_id}= await upload(file, uploadFolder);
                    brand.logo = {
                        path,
                        public_id
        };
        
        await brand.save();
        res.status(201).json({
            message: "brand created",
            success: true,
            status: "success",
            data: brand
        });
        
}
)

//* read/ get
export const getAll = catchAsync(
    async (req: Request, res: Response, next: NextFunction)=>{
        const brand = await Brand.find({});
        
        //* handle logo upload

        //* save brand
        // await brand.save();
        res.status(201).json({
            message: "brand created",
            success: true,
            status: "success",
            data: brand
        });
        

   
}
)

//* get by id
export const getById = catchAsync(
    async(req: Request, res: Response, next: NextFunction)=>{
        const {id} = req.params;
        const brand = await Brand.findOne({_id: id});

        if(!brand){
            throw new AppError("brand not found", 404);
        }

        res.status(201).json({
            message: `brand fetched by ${id}`,
            success: true,
            status: "success",
            data: brand
        });

   
}
);

//* update
export const update = catchAsync(
    async (req: Request, res: Response)=>{
            const {id} = req.params;
            const {name, description} = req.body;
            
            const updatedBrand = await Brand.findByIdAndUpdate({_id: id},{name, description});
    
            if(!updatedBrand) throw new AppError("Product not found", 404);
    
            res.status(200).json({
                message: `product by ${id} updated`,
                success: true,
                status: "success",
                data: updatedBrand,
            });
    
    
    }
);

//* delete
export const remove = catchAsync(
    async(req: Request, res: Response, next: NextFunction)=>{
        const {id}= req.params;
        const brand = await Brand.findByIdAndDelete({_id: id});
        if(!brand ){
            throw new AppError("brand not found", 404);
        }

        res.status(201).json({
            message: "brand updated",
            success: true,
            status: "success",
            data: null
        });

    
}
);
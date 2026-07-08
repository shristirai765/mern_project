import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import Brand from "../models/brand.model";
import { catchAsync } from "../utils/catchAsync.utils";



//* create
export const createBrand = catchAsync(
    async (req: Request, res: Response)=>{
        const {name, description} = req.body;

        if(!name){
            throw new AppError ("name is required", 400);
        }
        if(!description){
            throw new AppError ("description is required", 400);
        }

        const brand = new Brand({name, description});
        
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
        const {name, description} = req.body;

        if(!name){
            throw new AppError ("name is required", 400);
        }

        const brand = new Brand({name, description});
        
        //* handle logo upload

        //* save brand
        await brand.save();
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
    async(req: Request, res: Response, next: NextFunction)=>{
        const {id}= req.params;
        const brand = await Brand.findByIdAndUpdate({_id: id});
        if(!brand ){
            throw new AppError("brand not found", 404);
        }

        res.status(201).json({
            message: "brand updated",
            success: true,
            status: "success",
            data: brand
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
            data: brand
        });

    
}
);
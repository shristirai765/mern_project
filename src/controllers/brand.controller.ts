import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import Brand from "../models/brand.model";

//* create
export const create = async (req: Request, res: Response, next: NextFunction)=>{
    try{
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
        

    }catch(error){
        next(error);
    }
};

//* read/ get
export const getAllBrands = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const brand = await Brand.find({});

        res.status(201).json({
            message: "all brands fetched",
            success: true,
            status: "success",
            data: brand
        });

    }catch(error){
        next(error);
    }
};

//* get by id
export const getById = async(req: Request, res: Response, next: NextFunction)=>{
    try{
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

    }catch(error){
        next(error);
    }
};

//* update
export const update = async(req: Request, res: Response, next: NextFunction)=>{
    try{
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

    }catch(error){
        next(error);
    }
};

//* delete
export const remove = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const {id}= req.params;
        const brand = await Brand.findByIdAndDelete({_id: id});
        if(!brand ){
            throw new AppError("brand not found", 404);
        }

        res.status(201).json({
            message: "brand deleted",
            success: true,
            status: "success",
            data: null
        });

    }catch(error){
        next(error);
    }
};
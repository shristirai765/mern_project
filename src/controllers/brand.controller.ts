import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import Brand from "../models/brand.model";
import { catchAsync } from "../utils/catchAsync.utils";
import { upload } from "../utils/cloudinary.utils";
import { sendResponse } from "../utils/sendResponse.utils";

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
        sendResponse(res,{
            message: "brand created",
            statusCode: 201,
            data: brand,
        });
        
}
)

//* read/ get
export const getAll = catchAsync(
    async (req: Request, res: Response, next: NextFunction)=>{

        const { query } = req.query;
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

        const brand = await Brand.find(filter);


        sendResponse(res,{
            message: "all brands fetched",
            statusCode: 201,
            data: brand,
        });

        // res.status(201).json({
        //     message: "brand fetched",
        //     success: true,
        //     status: "success",
        //     data: brand
        // });
        

   
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

        sendResponse(res,{
            message: "brand fetched by id",
            statusCode: 201,
            data: brand,
        });
        // res.status(201).json({
        //     message: `brand fetched by ${id}`,
        //     success: true,
        //     status: "success",
        //     data: brand
        // });

   
}
);

//* update
export const update = catchAsync(
    async (req: Request, res: Response)=>{
            const {id} = req.params;
            const {name, description} = req.body;
            
            const updatedBrand = await Brand.findByIdAndUpdate({_id: id},{name, description});
    
            if(!updatedBrand) throw new AppError("Product not found", 404);
    
            sendResponse(res,{
                message: "brand updated",
                statusCode: 200,
                data: updatedBrand,
            });
            // res.status(200).json({
            //     message: `product by ${id} updated`,
            //     success: true,
            //     status: "success",
            //     data: updatedBrand,
            // });
    
    
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

        sendResponse(res,{
            message: "brands deleted",
            statusCode: 201,
            data: null,
        });
        // res.status(201).json({
        //     message: "brand deleted",
        //     success: true,
        //     status: "success",
        //     data: null
        // });

    
}
);
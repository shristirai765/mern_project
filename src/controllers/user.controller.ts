import {Response, Request, NextFunction} from "express";
import User from "../models/user.model";
import AppError from "../utils/appError.utils";

//! get all users
export const getAll = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const user = await User.find({ role: "USER"});

        //* send success response
        res.status(200).json({
            message: "all users fetched",
            status: "success",
            success: true,
            data: user,
        });

    }catch(error){
        next(error);
    }
}


//! get all admins
export const getAllAdmins = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const admins = await User.find({
            role:{
                $in: ["ADMIN", "SUPER ADMIN"],
            },
        });

        //* send success response
        res.status(200).json({
            message: "all admins fetched",
            status: "success",
            success: true,
            data: admins,
        });

    }catch(error){
        next(error);
    }
}

//! get user by id
export const getById = async(req: Request, res: Response, next: NextFunction)=>{
    try{
        const {id} = req.params;


        const user = await User.findOne({ _id: id});
        if(!user){
            throw new AppError("User not found", 404);
        }

        //* send success response
        res.status(201).json({
            message: `user fetched by ${id}`,
            status: "success",
            success: true,
            data: user,
        });

    }catch(error){
        next(error);
    }
};
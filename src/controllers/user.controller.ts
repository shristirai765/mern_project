import {Response, Request, NextFunction} from "express";
import User from "../models/user.model";
import AppError from "../utils/appError.utils";
import { Role } from "../types/enum.types";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";

//! get all users
export const getAll = catchAsync(
    async(req: Request, res: Response, next: NextFunction)=>{
        const user = await User.find({ role: Role.USER});

        //* send success response
        sendResponse(res,{
            message: `all users fetched`,
            statusCode: 200,
            data: user
        });
        // res.status(200).json({
        //     message: "all users fetched",
        //     status: "success",
        //     success: true,
        //     data: user,
        // });

    }
)


//! get all admins
export const getAllAdmins = catchAsync(
    async(req: Request, res: Response, next: NextFunction)=>{
        const admins = await User.find({
            role:{
                $in: [Role.ADMIN, Role.SUPER_ADMIN],
            },
        });

        //* send success response
        sendResponse(res,{
            message: `all admins fetched`,
            statusCode: 200,
            data: admins
        });
        // res.status(200).json({
        //     message: "all admins fetched",
        //     status: "success",
        //     success: true,
        //     data: admins,
        // });


    }
)

//! get user by id
export const getById = catchAsync(
    async(req: Request, res: Response, next: NextFunction)=>{
        const {id} = req.params;


        const user = await User.findOne({ _id: id});
        if(!user){
            throw new AppError("User not found", 404);
        }

        //* send success response
        sendResponse(res,{
            message: `user fetched by ${id}`,
            statusCode: 200,
            data: user
        });
        // res.status(201).json({
        //     message: `user fetched by ${id}`,
        //     status: "success",
        //     success: true,
        //     data: user,
        // });

    }
)

//* delete user
export const remove = catchAsync(
    async(req: Request, res: Response)=>{
        const { id} = req.params;
        const removedUser = await User.findByIdAndDelete({_id: id});
        if(!removedUser){
            throw new AppError("User not found", 404);
        }

        //* send success response
        sendResponse(res,{
            message: `user deleted successfully`,
            statusCode: 200,
            data: removedUser
        });

    }
)
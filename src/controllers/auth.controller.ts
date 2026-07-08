import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import {hashPassword, comparePassword } from "../utils/bcrypt.utils";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";

//* register
export const register = catchAsync(
    async (req: Request, res: Response, next: NextFunction)=>{
        const {full_name, email, password, phone } = req.body;

        if(!full_name){
            throw new AppError("full_name is required", 400);
            // const error: any = new Error("full_name is required");
            // error.statusCode = 400;
            // error.status= "fail";
            // throw error;

        }
        if(!email){
            throw new AppError("email is required", 400);
            // const error: any = new Error("email is required");
            // error.statusCode = 400;
            // error.status= "fail";
            // throw error;
        }
        if(!password) throw new AppError("password is required", 400);
        //     {
        //     const error: any = new Error("password is required");
        //     error.statusCode = 400;
        //     error.status= "fail";
        //     throw error;
        // }
        // const newUser = await User.create({full_name, email, password, phone});
        // instance create
        const user = new User({full_name, email, password, phone});

        //* hash password
        const hashPass = await hashPassword(password);
        user.password = hashPass;

        //* handle profile_image upload

        //! save user
        await user.save();

        //* success response
        res.status(201).json({
                message: "Account created",
                success: true,
                status: "success",
                data: user,
            });

    
}
)


//* login
export const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction)=>{
        //email, password
        const {email, password} = req.body;
        if(!email){
            throw new AppError("email is required", 400);
        }
        if(!password) throw new AppError("password is required", 400);

        //* find user by email
        const user = await User.findOne({email: email}).select("+password"); //-password

        if(!user){
            throw new AppError("credentials does not match", 400);
        };

        //* compare password
        const isPasswordMatch = await comparePassword(password, user.password);
        if(!isPasswordMatch){
            throw new AppError("credentials does not match", 400);
        };


        //* todo: generate jwt token

        //* send success response
        res.status(201).json({
            message: "login success",
            status: "success",
            success: true,
            data: user,
        });
    
}
)

//* get profile
//* change password
//* forgot password
//* change email
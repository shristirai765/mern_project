import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import {hashPassword, comparePassword } from "../utils/bcrypt.utils";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { deleteFile, upload } from "../utils/cloudinary.utils";
import { generateJwtToken } from "../utils/jwt.utils";
import { IJwtPayload } from "../types/global.types";
import ENV_CONFIG from "../config/env.config";
import { sendResponse } from "../utils/sendResponse.utils";

const uploadFolder = '/profile_image';

//* register
export const register = catchAsync(
    async (req: Request, res: Response, next: NextFunction)=>{
        const {full_name, email, password, phone } = req.body;
        const file = req.file;
        console.log(file);

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
        if(file){
            //* upload to cloudinary
            const { path, public_id}= await upload(file, uploadFolder);
            user.profile_image = {
                path,
                public_id
            };

        }

        //! save user
        await user.save();

        //* converting mongoose doc to js oject
        const {password: user_pass, ...rest} = user.toObject();

        //* success response
        res.status(201).json({
                message: "Account created",
                success: true,
                status: "success",
                data:{
                    user: rest,
                }
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
        // to know the user has logged in next time
        // json webtoken

        const payload:IJwtPayload = {
            _id: user._id,
            email: user.email,
            role: user.role,
        };
        const access_token = generateJwtToken(payload);

        res.cookie('access_token', access_token,{
            httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false: true,
            secure: ENV_CONFIG.NODE_ENV === "development" ? false: true,
            maxAge: 7 * 24* 60 *60 *1000,
            sameSite: ENV_CONFIG.NODE_ENV === "development" ? 'lax': 'none',
        });

        const {password: p, ...rest} = user.toObject();
        //* send success response
        sendResponse(res,{
            message: "Login message",
            statusCode: 201,
            data:{
                user: rest,
                 access_token,
            },
        });
        // res.status(201).json({
        //     message: "login success",
        //     status: "success",
        //     success: true,
        //     data: {
        //         user, 
        //         access_token,
        //     },
        // });
    
}
);

//* logout

//* get profile

//* change profile image
export const chnageProfileImage = catchAsync(
    async(req:Request, res: Response)=>{
       const {_id} = req.user;
       const file = req.file;
       if(!file){
        throw new AppError("Image is requuired", 400);
       }
       const user = await User.findOne({_id: _id});
       if(!user){
        throw new AppError("Profile not found", 404);
       }

       //! delete old image
       if(user.profile_image && user.profile_image.public_id){
            await deleteFile(user.profile_image.public_id);

       }
       const {path, public_id} = await upload(file, uploadFolder);
       user.profile_image = {
        path,
        public_id,
       };

       //* send success respnse
       sendResponse(res,{
        message: "Profile updated",
        statusCode: 200,
        data: user
       })
    }
)

//* change password
//* forgot password
//* change email
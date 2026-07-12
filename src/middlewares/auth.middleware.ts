import { NextFunction, Request, Response } from "express";
import { Role } from "../types/enum.types";
import { verifyJwtToken } from "../utils/jwt.utils";
import AppError from "../utils/appError.utils";
import ENV_CONFIG from "../config/env.config";


//* 1. login
//* 2. authorized ?

export const authenticate = (roles?: Role[]) => {
    return (req: Request, res:Response, next:NextFunction)=>{
        try{
            // Authorization header 
            // cookies
            //* 1. get access token
            const cookies = req.cookies;
            const access_token = cookies["access_token"];
            console.log(access_token);
            if(!access_token){
                throw new AppError("Unauthorized . LOgin required", 401);
            }
            //* 2. verify access token
            const decoded_data = verifyJwtToken(access_token);
            if(!decoded_data){
                throw new AppError("Invalid token. Login required", 401);
            }

            //* 3. check token expiry
            if(decoded_data.exp * 1000 <= Date.now()){
                //* clear cookie
                res.clearCookie("access_token", {
                    httpOnly: ENV_CONFIG.NODE_ENV === "development" ? false: true,
                    secure: ENV_CONFIG.NODE_ENV === "development" ? false: true,
                    maxAge: Date.now(),
                    sameSite: ENV_CONFIG.NODE_ENV === "development" ? 'lax': 'none',
                })
                    
                throw new AppError("TOken is expired. Access denied.", 401);
            }
            console.log(decoded_data)

            //* 4. role check
            if(roles && roles.length > 0 && !roles.includes(decoded_data.role)){
                throw new AppError("Unauthorized . Access denied.", 401);            
            }

            req.user= {
                _id: decoded_data._id,
                email: decoded_data.email,
                role: decoded_data.role,
            }
            next();

        }catch(error){
            next(error);
        }
    }

}
import { NextFunction, Request, Response } from "express";
import { Role } from "../types/enum.types";


//* 1. login
//* 2. authorized ?

export const authenticate = (role?: Role[]) => {
    return (req: Request, res:Response, next:NextFunction)=>{
        try{
            // Authorization header 
            // cookies
            //* 1. get access token

            //* 2. verify access token

            //* 3. check token expiry
            //* 4. role check
            next();

        }catch(error){
            next(error);
        }
    }

}
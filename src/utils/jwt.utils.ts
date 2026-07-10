import jwt from "jsonwebtoken";
import { IJwtPayload } from "../types/global.types";

//* generate jwt token

export const generateJwtToken = (payload: IJwtPayload)=>{
    try{

        return jwt.sign(payload, 'dagnjfdghoriajsggrvfd',{
            expiresIn: 7 * 24 * 60* 60 *1000,
        });

    }catch(error){
        console.log(error);
        throw error;
    }
}
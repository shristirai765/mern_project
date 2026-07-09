import cloudinary from "../config/cloudinary.config";
import AppError from "./appError.utils";
import fs from "fs";


//* upload
export const upload = async(file: Express.Multer.File, dir = "/")=>{
    try{
        const folder = "team_14_3_30" + dir;
        const { public_id, secure_url }= await cloudinary.uploader.upload(file.path, {
            unique_filename: true,
            folder: folder,
            transformation:{
                height: 1000,
                width: 1000,
                fetch_format: "auto",
                format: "auto",
                crop: "fill",
                gravity: "face",
            }
        });

        //* delete local file
        if(fs.existsSync(file.path)){
            fs.unlinkSync(file.path);
        }
        return {
            public_id,
            path: secure_url,
        };

    }catch(error){
        console.log(error);
        throw new AppError(`Something went wrong`, 500);
    }
}
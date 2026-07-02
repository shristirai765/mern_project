import mongoose from "mongoose";



export const connectDatabase = (DB_URL: string)=>{
    mongoose.connect(DB_URL)
    .then(()=>{
        console.log("Database connected");
    }).catch((error)=>{
        console.log("----database connection error----");
            console.log(error);
    });
};
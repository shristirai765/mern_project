
process.on("uncaughtException", (error)=>{
    console.log("uncaughtException", error);
    process.exit(1);
});


// import dotenv from "dotenv";
import "dotenv/config";
// import + call in a same line
import app from "./app";
import { connectDatabase } from "./config/db.config";
import ENV_CONFIG from "./config/env.config";
import mongoose from "mongoose";
// import { verifyMailServerConnection } from "./config/nodemailer.config";
// import { sendEmail } from "./utils/emailServer.utils";

const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI;
// const DB_URL = 'mongodb+srv://';

connectDatabase(DB_URI);

//* listen
const server = app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    // verifyMailServerConnection();
    // sendEmail();
});

process.on("unhandledRejection", (error)=>{
    console.log("unhandledRejection", error);
    server.close(async(error)=>{
        await mongoose.disconnect();
        process.exit(1);
    });
});

process.on("SIGINT", ()=>{
    console.log("SIGINT");
    server.close(async (error)=>{
        console.log(error);
        await mongoose.disconnect();
        process.exit(0);

    });
});

process.on("SIGTERM", ()=>{
    console.log("SIGTERM");
    server.close(async (error)=>{
        console.log(error);
        await mongoose.disconnect();
        process.exit(0);

    });
});

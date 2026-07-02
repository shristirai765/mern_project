import express, { NextFunction, Request, Response } from "express";
// @types/packagename

//! creating app instance
const app = express();

//! using middlewares

//! using routes

//* health route
app.get("/", (req: Request, res: Response, next: NextFunction)=>{
    res.status(200).json({
        message: "server is up and running",
        success: true,
        status: "success",
        data: null,
    });
});

//! path not found

export default app;

// dev depen

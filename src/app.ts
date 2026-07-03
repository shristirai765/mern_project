import express, { NextFunction, Request, Response } from "express";
// @types/packagename
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "./routes/auth.routes";

//! creating app instance
const app = express();

//! using middlewares
app.use(express.json({limit: "10mb"}));


//* health route
app.get("/", (req: Request, res: Response, next: NextFunction)=>{
    res.status(200).json({
        message: "server is up and running",
        success: true,
        status: "success",
        data: null,
    });
});

//! using routes
app.use('/api/v1/auth', authRoutes);

//! path not found
app.use((req: Request, res: Response, next: NextFunction)=>{
    const message= `Can not ${req.method} on ${req.body}`;

    // res.status(404).json({
    //     message,
    //     success: false,
    //     status: "fail",
    //     data: null
    // });
    const error:any = new Error(message);
    error.status = "fail";
    error.statusCode= 404;
    next(error);
});

export default app;

//* using error handler
app.use(errorHandler);
// dev depen

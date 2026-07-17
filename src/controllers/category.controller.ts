import { Request, Response, NextFunction } from "express";
import Category from "../models/category.model";
import { catchAsync } from "../utils/catchAsync.utils";
import AppError from "../utils/appError.utils";
import { upload } from "../utils/cloudinary.utils";
import { sendResponse } from "../utils/sendResponse.utils";


const uploadFolder = '/logo';



//* get all -> sapana
export const getAll = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const { query } = req.query;
    const filter: Record<string, any> = {};

        if(query){
            filter.$or =[
                {
                    name:{
                        $regex: query,
                        $options: "i",
                    },
                },
                {
                    description:{
                        $regex: query,
                    $options: "i",
                    }
                },
            ];
        }
    const categories = await Category.find(filter);

    sendResponse(res,{
      message: "all categories fetched",
      statusCode: 200,
      data: categories
    });
    // res.status(200).json({
    //   success: true,
    //   count: categories.length,
    //   data: categories,
    // });
  },
);

//* get by id  -> rubina

export const getById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError("category not found", 404);
    }

    sendResponse(res,{
        message: "category fetched by id",
        statusCode: 201,
        data: category,
    });

    // res.status(200).json({
    //   message: `category by id ${id} is fetched`,
    //   success: true,
    //   status: "success",
    //   data: category,
    // });
  },
);

//* create  -> ashmita
export const create = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies)
    const { name, description } = req.body;
    const file = req.file;
    if (!file) throw new AppError("file is required", 404);
    if (!name) throw new AppError("name is required", 404);
    if (!description) throw new AppError("description is required", 404);

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      throw new AppError("name already exists", 404);
    }

    const category = new Category({ name, description });

    const { path, public_id}= await upload(file, uploadFolder);
    category.logo = {
      path,
      public_id
    };

    await category.save();

    sendResponse(res,{
        message: "category created successully",
        statusCode: 201,
        data: category,
    });
    // res.status(201).json({
    //   message: "Category created successfully",
    //   status: "success",
    //   success: true,
    //   data: category,
    // });
  }
);

//* update  -> atit

export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const existingCategory = await Category.findById({ id });

    if (!existingCategory) {
      throw new AppError("Brand does not exist", 404);
    }

    const { name, description } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      { _id: id },
      { name, description },
      { new: true },
    );

    sendResponse(res,{
      message: "category updated",
      statusCode: 201,
      data: updatedCategory,
    });
    // res.status(201).json({
    //   success: true,
    //   message: "Brand updated successfully.",
    //   data: updatedCategory,
    // });
  },
);

//* delete  -> shristi
export const remove = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete({ _id: id });

    if (!category) {
      throw new AppError("category not found.", 404);
    }

    sendResponse(res,{
      message: "category deleted successfully",
      statusCode: 200,
      data: null
    });

    // res.status(200).json({
    //   message: "category deleted successfully.",
    //   success: true,
    //   status: "success",
    //   data: null,
    // });
  },
);

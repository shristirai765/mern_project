"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const category_model_1 = __importDefault(require("../models/category.model"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const uploadFolder = '/logo';
//* get all -> sapana
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { query } = req.query;
    const filter = {};
    if (query) {
        filter.$or = [
            {
                name: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: query,
                    $options: "i",
                }
            },
        ];
    }
    const categories = await category_model_1.default.find(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "all categories fetched",
        statusCode: 200,
        data: categories
    });
    // res.status(200).json({
    //   success: true,
    //   count: categories.length,
    //   data: categories,
    // });
});
//* get by id  -> rubina
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const category = await category_model_1.default.findById(id);
    if (!category) {
        throw new appError_utils_1.default("category not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
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
});
//* create  -> ashmita
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    console.log(req.cookies);
    const { name, description } = req.body;
    const file = req.file;
    if (!file)
        throw new appError_utils_1.default("file is required", 404);
    if (!name)
        throw new appError_utils_1.default("name is required", 404);
    if (!description)
        throw new appError_utils_1.default("description is required", 404);
    const existingCategory = await category_model_1.default.findOne({ name });
    if (existingCategory) {
        throw new appError_utils_1.default("name already exists", 404);
    }
    const category = new category_model_1.default({ name, description });
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
    category.logo = {
        path,
        public_id
    };
    await category.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
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
});
//* update  -> atit
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const existingCategory = await category_model_1.default.findById({ id });
    if (!existingCategory) {
        throw new appError_utils_1.default("Brand does not exist", 404);
    }
    const { name, description } = req.body;
    const updatedCategory = await category_model_1.default.findByIdAndUpdate({ _id: id }, { name, description }, { new: true });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "category updated",
        statusCode: 201,
        data: updatedCategory,
    });
    // res.status(201).json({
    //   success: true,
    //   message: "Brand updated successfully.",
    //   data: updatedCategory,
    // });
});
//* delete  -> shristi
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const category = await category_model_1.default.findByIdAndDelete({ _id: id });
    if (!category) {
        throw new appError_utils_1.default("category not found.", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
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
});

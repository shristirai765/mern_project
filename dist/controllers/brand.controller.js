"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getById = exports.getAll = exports.createBrand = void 0;
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const brand_model_1 = __importDefault(require("../models/brand.model"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const pagination_utils_1 = require("../utils/pagination.utils");
const uploadFolder = '/logo';
//* create
exports.createBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;
    if (!file) {
        throw new appError_utils_1.default("file is required", 400);
    }
    if (!name) {
        throw new appError_utils_1.default("name is required", 400);
    }
    if (!description) {
        throw new appError_utils_1.default("description is required", 400);
    }
    const brand = new brand_model_1.default({ name, description });
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
    brand.logo = {
        path,
        public_id
    };
    await brand.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brand created",
        statusCode: 201,
        data: brand,
    });
});
//* read/ get
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { query, order = "DESC", sortBy = "price", page = 1, limit = 10 } = req.query;
    const currentPage = Number(page);
    const perPage = Number(limit);
    const skip = (currentPage - 1) * perPage;
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
        //* for and
        /*
        filter.$and =[
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

        or

        filter.name={}
        filter.description={}

        */
    }
    const brand = await brand_model_1.default.find(filter)
        .limit(perPage)
        .skip(skip)
        .sort({
        [sortBy]: order === "DESC" ? -1 : 1,
    });
    const totalCount = await brand_model_1.default.countDocuments(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "all brands fetched",
        statusCode: 200,
        data: {
            brand,
            pagination: (0, pagination_utils_1.getPagination)(totalCount, perPage, currentPage),
        },
    });
    // res.status(201).json({
    //     message: "brand fetched",
    //     success: true,
    //     status: "success",
    //     data: brand
    // });
});
//* get by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findOne({ _id: id });
    if (!brand) {
        throw new appError_utils_1.default("brand not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brand fetched by id",
        statusCode: 201,
        data: brand,
    });
    // res.status(201).json({
    //     message: `brand fetched by ${id}`,
    //     success: true,
    //     status: "success",
    //     data: brand
    // });
});
//* update
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const updatedBrand = await brand_model_1.default.findByIdAndUpdate({ _id: id }, { name, description });
    if (!updatedBrand)
        throw new appError_utils_1.default("Product not found", 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brand updated",
        statusCode: 200,
        data: updatedBrand,
    });
    // res.status(200).json({
    //     message: `product by ${id} updated`,
    //     success: true,
    //     status: "success",
    //     data: updatedBrand,
    // });
});
//* delete
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const brand = await brand_model_1.default.findByIdAndDelete({ _id: id });
    if (!brand) {
        throw new appError_utils_1.default("brand not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "brands deleted",
        statusCode: 201,
        data: null,
    });
    // res.status(201).json({
    //     message: "brand deleted",
    //     success: true,
    //     status: "success",
    //     data: null
    // });
});

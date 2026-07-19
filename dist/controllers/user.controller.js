"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.getById = exports.getAllAdmins = exports.getAll = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const enum_types_1 = require("../types/enum.types");
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
//! get all users
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const user = await user_model_1.default.find({ role: enum_types_1.Role.USER });
    //* send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `all users fetched`,
        statusCode: 200,
        data: user
    });
    // res.status(200).json({
    //     message: "all users fetched",
    //     status: "success",
    //     success: true,
    //     data: user,
    // });
});
//! get all admins
exports.getAllAdmins = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const admins = await user_model_1.default.find({
        role: {
            $in: [enum_types_1.Role.ADMIN, enum_types_1.Role.SUPER_ADMIN],
        },
    });
    //* send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `all admins fetched`,
        statusCode: 200,
        data: admins
    });
    // res.status(200).json({
    //     message: "all admins fetched",
    //     status: "success",
    //     success: true,
    //     data: admins,
    // });
});
//! get user by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { id } = req.params;
    const user = await user_model_1.default.findOne({ _id: id });
    if (!user) {
        throw new appError_utils_1.default("User not found", 404);
    }
    //* send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `user fetched by ${id}`,
        statusCode: 200,
        data: user
    });
    // res.status(201).json({
    //     message: `user fetched by ${id}`,
    //     status: "success",
    //     success: true,
    //     data: user,
    // });
});
//* delete user
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const removedUser = await user_model_1.default.findByIdAndDelete({ _id: id });
    if (!removedUser) {
        throw new appError_utils_1.default("User not found", 404);
    }
    //* send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `user deleted successfully`,
        statusCode: 200,
        data: removedUser
    });
});

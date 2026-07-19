"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeProfileImage = exports.getProfile = exports.logout = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const emailServer_utils_1 = require("../utils/emailServer.utils");
const emailTemplate_utils_1 = require("../utils/emailTemplate.utils");
const mongoose_1 = __importDefault(require("mongoose"));
const uploadFolder = '/profile_image';
//* register
exports.register = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const { full_name, email, password, phone } = req.body;
    const file = req.file;
    console.log(file);
    if (!full_name) {
        throw new appError_utils_1.default("full_name is required", 400);
        // const error: any = new Error("full_name is required");
        // error.statusCode = 400;
        // error.status= "fail";
        // throw error;
    }
    if (!email) {
        throw new appError_utils_1.default("email is required", 400);
        // const error: any = new Error("email is required");
        // error.statusCode = 400;
        // error.status= "fail";
        // throw error;
    }
    if (!password)
        throw new appError_utils_1.default("password is required", 400);
    //     {
    //     const error: any = new Error("password is required");
    //     error.statusCode = 400;
    //     error.status= "fail";
    //     throw error;
    // }
    // const newUser = await User.create({full_name, email, password, phone});
    // instance create
    const user = new user_model_1.default({ full_name, email, password, phone });
    //* hash password
    const hashPass = await (0, bcrypt_utils_1.hashPassword)(password);
    user.password = hashPass;
    //* handle profile_image upload
    if (file) {
        //* upload to cloudinary
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
        user.profile_image = {
            path,
            public_id
        };
    }
    //! save user
    await user.save();
    //* send account created email
    (0, emailServer_utils_1.sendEmail)({
        to: user.email,
        subject: "Account created",
        html: (0, emailTemplate_utils_1.accountCreatedHtml)({
            full_name: user.full_name,
            email: user.email,
            createdAt: user.createdAt,
        }),
    });
    //* converting mongoose doc to js oject
    const { password: user_pass, ...rest } = user.toObject();
    //* success response
    res.status(201).json({
        message: "Account created",
        success: true,
        status: "success",
        data: {
            user: rest,
        }
    });
});
//* login
exports.login = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    //email, password
    const { email, password } = req.body;
    if (!email) {
        throw new appError_utils_1.default("email is required", 400);
    }
    if (!password)
        throw new appError_utils_1.default("password is required", 400);
    console.log("Mongoose readyState:", mongoose_1.default.connection.readyState);
    //* find user by email
    const user = await user_model_1.default.findOne({ email: email }).select("+password"); //-password
    if (!user) {
        throw new appError_utils_1.default("credentials does not match", 400);
    }
    ;
    //* compare password
    const isPasswordMatch = await (0, bcrypt_utils_1.comparePassword)(password, user.password);
    if (!isPasswordMatch) {
        throw new appError_utils_1.default("credentials does not match", 400);
    }
    ;
    (0, emailServer_utils_1.sendEmail)({
        to: user.email,
        subject: "Login Detected ",
        html: (0, emailTemplate_utils_1.newLoginDetectedHtml)({
            full_name: user.full_name,
            email: user.email,
            loginTime: new Date(Date.now()),
            device: req.headers["user-agent"],
        })
    });
    //* todo: generate jwt token
    // to know the user has logged in next time
    // json webtoken
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
    };
    const access_token = (0, jwt_utils_1.generateJwtToken)(payload);
    res.cookie('access_token', access_token, {
        httpOnly: env_config_1.default.NODE_ENV === "development" ? false : true,
        secure: env_config_1.default.NODE_ENV === "development" ? false : true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: env_config_1.default.NODE_ENV === "development" ? 'lax' : 'none',
    });
    const { password: p, ...rest } = user.toObject();
    //* send success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Login message",
        statusCode: 201,
        data: {
            user: rest,
            access_token,
        },
    });
    // res.status(201).json({
    //     message: "login success",
    //     status: "success",
    //     success: true,
    //     data: {
    //         user, 
    //         access_token,
    //     },
    // });
});
//* logout
exports.logout = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    // const {token} = req.token;
});
//* get profile
exports.getProfile = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { _id } = req.user;
    const user = await user_model_1.default.findOne({ _id: _id });
    if (!user) {
        throw new appError_utils_1.default("Profile not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "user profile",
        statusCode: 200,
        data: user
    });
});
//* change profile image
exports.changeProfileImage = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { _id } = req.user;
    const file = req.file;
    if (!file) {
        throw new appError_utils_1.default("Image is requuired", 400);
    }
    const user = await user_model_1.default.findOne({ _id: _id });
    if (!user) {
        throw new appError_utils_1.default("Profile not found", 404);
    }
    //! delete old image
    if (user.profile_image && user.profile_image.public_id) {
        await (0, cloudinary_utils_1.deleteFile)(user.profile_image.public_id);
    }
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(file, uploadFolder);
    user.profile_image = {
        path,
        public_id,
    };
    //* send success respnse
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Profile updated",
        statusCode: 200,
        data: user
    });
});
//* change password
//* forgot password
//* change email

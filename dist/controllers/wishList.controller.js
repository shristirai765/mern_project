"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clear_Wishlist = exports.Remove_Wishlist = exports.Get_Wishlist = exports.Add_Wishlist = void 0;
const wishList_model_1 = __importDefault(require("../models/wishList.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
//* Add Product to Wishlist
exports.Add_Wishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.body;
    if (!productId) {
        throw new appError_utils_1.default("Product ID is required", 400);
    }
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        throw new appError_utils_1.default("Product not found", 404);
    }
    let wishlist = await wishList_model_1.default.findOne({ user: userId });
    if (!wishlist) {
        wishlist = await wishList_model_1.default.create({
            user: userId,
            product: [productId],
        });
    }
    else {
        if (wishlist.product.some((item) => item.toString() === productId)) {
            throw new appError_utils_1.default("Product already exists in wishlist", 400);
        }
        wishlist.product.push(productId);
        await wishlist.save();
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product added to wishlist successfully",
        statusCode: 200,
        data: wishlist,
    });
});
//* Get Wishlist
exports.Get_Wishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user._id;
    const wishlist = await wishList_model_1.default.findOne({ user: userId }).populate("products");
    if (!wishlist) {
        return res.status(200).json({
            success: true,
            wishlist: [],
        });
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "wishlist is fetched",
        statusCode: 200,
        data: wishlist,
    });
});
//* Remove Product from Wishlist
exports.Remove_Wishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const wishlist = await wishList_model_1.default.findOne({ user: userId });
    if (!wishlist) {
        throw new appError_utils_1.default("Wishlist not found", 404);
    }
    wishlist.product = wishlist.product.filter((item) => item.toString() !== productId);
    await wishlist.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "product is removed from wishlist successfully",
        statusCode: 200,
        data: wishlist,
    });
});
//* Clear Wishlist
exports.Clear_Wishlist = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user._id;
    const wishlist = await wishList_model_1.default.findOne({ user: userId });
    if (!wishlist) {
        throw new appError_utils_1.default("Wishlist not found", 404);
    }
    wishlist.product = [];
    await wishlist.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Wishlist cleared successfully",
        statusCode: 200,
        data: wishlist,
    });
});

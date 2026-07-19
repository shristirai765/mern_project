"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clear_Cart = exports.Remove_Cart = exports.Update_Cart = exports.Get_Cart = exports.Add_Cart = void 0;
const cart_model_1 = __importDefault(require("../models/cart.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
// * Add to Cart
exports.Add_Cart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    if (!productId) {
        throw new appError_utils_1.default("Product ID is required", 400);
    }
    const product = await product_model_1.default.findById(productId);
    if (!product) {
        throw new appError_utils_1.default("Product not found", 404);
    }
    let cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        cart = await cart_model_1.default.create({
            user: userId,
            items: [
                {
                    product: productId,
                    quantity: quantity || 1,
                },
            ],
        });
    }
    else {
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity ?? 1;
            if (quantity && quantity < 1) {
                throw new appError_utils_1.default("Quantity must be at least 1", 400);
            }
        }
        else {
            cart.items.push({
                product: productId,
                quantity: quantity || 1,
            });
        }
        await cart.save();
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product added to cart successfully",
        statusCode: 200,
        data: cart,
    });
});
//* Get Cart
exports.Get_Cart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user._id;
    const cart = await cart_model_1.default.findOne({ user: userId }).populate("items.product");
    if (!cart) {
        return (0, sendResponse_utils_1.sendResponse)(res, {
            message: "Cart is empty",
            statusCode: 200,
            data: [],
        });
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart fetched successfully",
        statusCode: 200,
        data: cart,
    });
});
//* Update Quantity
exports.Update_Cart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    if (quantity < 1) {
        throw new appError_utils_1.default("Quantity must be at least 1", 400);
    }
    const cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new appError_utils_1.default("Cart not found", 404);
    }
    const item = cart.items.find((item) => item.product.toString() === productId);
    if (!item) {
        throw new appError_utils_1.default("Product not found in cart", 404);
    }
    item.quantity = quantity;
    await cart.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart updated successfully",
        statusCode: 200,
        data: cart,
    });
});
//* Remove Product
exports.Remove_Cart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user._id;
    const { productId } = req.params;
    const cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new appError_utils_1.default("Cart not found", 404);
    }
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product removed from cart successfully",
        statusCode: 200,
        data: cart,
    });
});
//* Clear Cart
exports.Clear_Cart = (0, catchAsync_utils_1.catchAsync)(async (req, res, next) => {
    const userId = req.user._id;
    const cart = await cart_model_1.default.findOne({ user: userId });
    if (!cart) {
        throw new appError_utils_1.default("Cart not found", 404);
    }
    cart.items = [];
    await cart.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart cleared successfully",
        statusCode: 200,
        data: cart,
    });
});

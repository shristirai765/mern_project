import { Request, Response, NextFunction } from "express";
import Cart from "../models/cart.model";
import Product from "../models/product.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";

//* Add to Cart

export const Add_Cart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId) {
      throw new appError("Product ID is required", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new appError("Product not found", 404);
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity: quantity || 1,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        existingItem.quantity += quantity ?? 1;
        if (quantity && quantity < 1) {
          throw new appError("Quantity must be at least 1", 400);
        }
      } else {
        cart.items.push({
          product: productId,
          quantity: quantity || 1,
        });
      }

      await cart.save();
    }

    sendResponse(res, {
      message: "Product added to cart successfully",
      statusCode: 200,
      data: cart,
    });
  },
);

//* Get Cart

export const Get_Cart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return sendResponse(res, {
        message: "Cart is empty",
        statusCode: 200,
        data: [],
      });
    }

    sendResponse(res, {
      message: "Cart fetched successfully",
      statusCode: 200,
      data: cart,
    });
  },
);

//* Update Quantity

export const Update_Cart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      throw new appError("Quantity must be at least 1", 400);
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new appError("Cart not found", 404);
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      throw new appError("Product not found in cart", 404);
    }

    item.quantity = quantity;

    await cart.save();

    sendResponse(res, {
      message: "Cart updated successfully",
      statusCode: 200,
      data: cart,
    });
  },
);

//* Remove Product

export const Remove_Cart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new appError("Cart not found", 404);
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    sendResponse(res, {
      message: "Product removed from cart successfully",
      statusCode: 200,
      data: cart,
    });
  },
);

//* Clear Cart

export const Clear_Cart = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      throw new appError("Cart not found", 404);
    }

    cart.items = [];

    await cart.save();

    sendResponse(res, {
      message: "Cart cleared successfully",
      statusCode: 200,
      data: cart,
    });
  },
);
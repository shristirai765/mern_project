import { Request, Response, NextFunction } from "express";
import Wishlist from "../models/wishList.model";
import Product from "../models/product.model";
import appError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";

//* Add Product to Wishlist

export const Add_Wishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      throw new appError("Product ID is required", 400);
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new appError("Product not found", 404);
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: userId,
        product: [productId],
      });
    } else {
      if (wishlist.product.some((item) => item.toString() === productId)) {
        throw new appError("Product already exists in wishlist", 400);
      }

      wishlist.product.push(productId);
      await wishlist.save();
    }

    sendResponse(res, {
      message: "Product added to wishlist successfully",
      statusCode: 200,
      data: wishlist,
    });
  },
);

//* Get Wishlist

export const Get_Wishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products",
    );

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        wishlist: [],
      });
    }

    sendResponse(res, {
      message: "wishlist is fetched",
      statusCode: 200,
      data: wishlist,
    });
  },
);

//* Remove Product from Wishlist

export const Remove_Wishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      throw new appError("Wishlist not found", 404);
    }

    wishlist.product = wishlist.product.filter(
      (item) => item.toString() !== productId,
    );

    await wishlist.save();

    sendResponse(res, {
      message: "product is removed from wishlist successfully",
      statusCode: 200,
      data: wishlist,
    });
  },
);

//* Clear Wishlist

export const Clear_Wishlist = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      throw new appError("Wishlist not found", 404);
    }

    wishlist.product = [];

    await wishlist.save();

    sendResponse(res, {
      message: "Wishlist cleared successfully",
      statusCode: 200,
      data: wishlist,
    });
  },
);
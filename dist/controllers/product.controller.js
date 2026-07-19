"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeatured = exports.getNewArrivals = exports.getByBrand = exports.getByCategory = exports.remove = exports.update = exports.getById = exports.getAll = exports.createProduct = void 0;
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const product_model_1 = __importDefault(require("../models/product.model"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const uploadFolder = "/cover_image";
exports.createProduct = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { cover_image, images } = req.files;
    const { name, description, price, brand, category, new_arrival, is_featured, } = req.body;
    if (!cover_image || !cover_image[0]) {
        throw new appError_utils_1.default("cover image is required", 400);
    }
    const product = new product_model_1.default({
        name,
        description,
        price,
        brand,
        category,
        new_arrival,
        is_featured,
    });
    //* upload cover_image
    const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], uploadFolder);
    product.cover_image = {
        path,
        public_id,
    };
    //Promise.all(arr_promise)
    //Promise.allSettled(arr_promise)
    //Promise.race(arr_promise)
    //Promise.any(arr_promise)
    //* upload images
    if (images && images.length > 0) {
        const promises = images.map((file) => (0, cloudinary_utils_1.upload)(file, uploadFolder));
        const files = await Promise.allSettled(promises);
        const fullFilled = files
            .filter((promise) => promise.status === "fulfilled")
            .map((img) => img.value);
        product.set("images", fullFilled);
    }
    //* save product
    await product.save();
    //* send response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "product created",
        data: product,
        statusCode: 201,
    });
});
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { query } = req.query;
    const { brand, category } = req.query;
    const { minPrice, maxPrice } = req.query;
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
    if (category) {
        filter.category = category;
    }
    if (brand) {
        filter.brand = brand;
    }
    //* price range
    if (minPrice || maxPrice) {
        const low = Number(minPrice);
        const high = Number(maxPrice);
        if (low) {
            filter.price = {
                $gte: low,
            };
        }
        if (high) {
            filter.price = {
                $lte: high,
            };
        }
        if (low && high) {
            filter.price = {
                $lte: high,
                $gte: low,
            };
        }
    }
    const product = await product_model_1.default.find(filter);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "all products fetched",
        statusCode: 200,
        data: product,
    });
    // res.status(200).json({
    //     message: "All products fetched",
    //     success: true,
    //     status: "success",
    //     data: product,
    // });
});
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product)
        throw new appError_utils_1.default("Product not found", 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Product by ${id} fetched`,
        statusCode: 200,
        data: product,
    });
    // res.status(200).json({
    //     message: `Product by ${id} fetched`,
    //     success: true,
    //     status: "success",
    //     data: product,
    // });
});
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    let { cover_image, images } = req.files;
    const { id } = req.params;
    const { name, description, category, brand, price, new_arrival, is_featured, deleted_images } = req.body;
    const product = await product_model_1.default.findById(id);
    if (!product)
        throw new appError_utils_1.default("product not found", 404);
    if (name)
        product.name = name;
    if (description)
        product.description = description;
    if (brand)
        product.brand = brand;
    if (price)
        product.price = price;
    if (new_arrival)
        product.new_arrival = new_arrival;
    if (is_featured)
        product.is_featured = is_featured;
    if (category)
        product.category = category;
    // Update cover image
    if (cover_image && cover_image[0]) {
        await (0, cloudinary_utils_1.deleteFile)(product.cover_image.public_id);
        const { path, public_id } = await (0, cloudinary_utils_1.upload)(cover_image[0], uploadFolder);
        product.cover_image = {
            path,
            public_id
        };
    }
    // let existingImages = product.images.map(img => ({
    //     path: img.path,
    //     public_id: img.public_id
    // }));
    // Delete selected images
    if (deleted_images && Array.isArray(deleted_images) && deleted_images.length > 0) {
        // for (const img of deleted_images) {
        //     await deleteFile(img.public_id);
        // }
        // existingImages = existingImages.filter((image) => {
        //     return !deleted_images.some((deleted: any) => {
        //         return deleted.public_id === image.public_id;
        //     });
        // });
        Promise.allSettled(deleted_images.map((public_id) => (0, cloudinary_utils_1.deleteFile)(public_id)));
        product.images = product.images.filter((img) => !deleted_images.includes(img.public_id.toString()));
    }
    // Upload newly selected images
    if (images && images.length > 0) {
        const files = await Promise.allSettled(images.map((file) => (0, cloudinary_utils_1.upload)(file, uploadFolder)));
        const newImages = files.filter((file) => file.status === "fulfilled")
            .map((file) => file.value);
        //.map((img)=>{
        //     return{
        //         path.img.path,
        //         public_id: img.public_id
        //     }
        // });
        product.set("images", [...product.images, ...newImages]);
        // for (const file of uploadedImages) {
        //     const { path, public_id } = await upload(
        //         file,
        //         uploadFolder
        //     );
        //     existingImages.push({
        //         path,
        //         public_id
        //     });
        // }
    }
    // product.set("images",existingImages);
    await product.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product updated",
        statusCode: 200,
        data: product
    });
});
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_model_1.default.findOne({ _id: id });
    if (!product)
        throw new appError_utils_1.default("product not found", 404);
    //* delete cover image
    (0, cloudinary_utils_1.deleteFile)(product.cover_image.public_id);
    //* delete images
    if (product.images && product.images.length > 0) {
        Promise.allSettled(product.images.map(img => (0, cloudinary_utils_1.deleteFile)(img.public_id)));
    }
    //* delete
    await product.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `product: ${id} deleted`,
        statusCode: 200,
        data: null,
    });
    // res.status(200).json({
    //     message: `Product by ${id} deleted successfully`,
    //     success: true,
    //     status: "success",
    //     data: null
    // });
});
//* get by category
exports.getByCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { categoryId } = req.params;
    const product = await product_model_1.default.find({ category: categoryId });
    if (!product)
        throw new appError_utils_1.default("Product not found", 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Product by ${categoryId} fetched`,
        statusCode: 200,
        data: product,
    });
});
//* get by brand
exports.getByBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { brandId } = req.params;
    const product = await product_model_1.default.find({ brand: brandId });
    if (!product)
        throw new appError_utils_1.default("Product not found", 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Product by ${brandId} fetched`,
        statusCode: 200,
        data: product,
    });
});
//* get new arrivals
exports.getNewArrivals = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const new_arrival = await product_model_1.default.find({ new_arrival: true });
    if (new_arrival.length === 0) {
        throw new appError_utils_1.default("New arrivals not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "New arrivals fetched",
        statusCode: 200,
        data: new_arrival,
    });
});
//* get featured
exports.getFeatured = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const is_featured = await product_model_1.default.find({ is_featured: true });
    if (is_featured.length === 0) {
        throw new appError_utils_1.default("Featured not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "featured product fetched",
        statusCode: 200,
        data: is_featured,
    });
});

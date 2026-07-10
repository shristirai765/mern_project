import mongoose from "mongoose";
import ImageSchema from "./image.model";


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: 3,
    },
    brand:{
        type: String,
        required: [true, "brand is required"],
    },
    price:{
        type: Number,
        required: [true, "price is required"],
    },
    product_picture:{
        type: ImageSchema,
        required: [true, "product_picture is required"],
    }

},{timestamps: true}
);


const Product = mongoose.model("product", productSchema);
export default Product;
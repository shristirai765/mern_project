import mongoose from "mongoose";
import ImageSchema from "./image.model";


const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "name is required"],
        trim: true,
        minLength: 3,
    },
    description:{
        type: String,
        required: [true, "description is required"],
        minLength: 30,
        maxLength: 500,
    },
    price:{
        type: Number,
        required: [true, "price is required"],
        min: 0,
    },
    cover_image:{
        type: ImageSchema,
        required: [true, "cover image is required"],
    },
    // database store category: fkdslgdf=>{}
    category:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "category is required"],
        ref: "category",
    },
    brand:{
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "brand is required"],
        ref: "brand",
    },
    images:[
        {
        type: ImageSchema,
        default: null,
    }],
    new_arrival:{
        type: Boolean,
        default: true,
    },
    is_featured:{
        type: Boolean,
        default: false,
    },

},{timestamps: true}
);


const Product = mongoose.model("product", productSchema);
export default Product;
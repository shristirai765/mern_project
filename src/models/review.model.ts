import mongoose from "mongoose";
import { number } from "zod";


const reviewSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
      unique: true,
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: [true, "product is required"],
    },

    rating:{
        type: number,
        default: 0,
    },
    text:{
        type: String,
        required: true,
        minLength: 5,
        maxLength: 500,
    }, 
},{timestamps: true}
);

const Review = mongoose.model("review", reviewSchema);
export default Review;
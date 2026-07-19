//product id : , user id:

import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId[];
}

const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
      unique: true,
    },

    product: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: [true, "product is required"],
      },
    ],
  },

  { timestamps: true },
);

const Wishlist = mongoose.model<IWishlist>("Wishlist", WishlistSchema);

export default Wishlist;
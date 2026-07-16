//* user, product -id

import mongoose from "mongoose";

const wistListSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },

});

const WishList = mongoose.model("wishlist", wistListSchema);

export default WishList;
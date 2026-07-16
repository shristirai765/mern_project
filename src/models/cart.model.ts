import mongoose from "mongoose";

// user, items[{product: id, quantity}]

const cartSchema = new mongoose.Schema({
    user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
    },
    items:[{
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        quantity:{
            type: Number,
            default: 1
        }
    }]


})

const Cart = mongoose.model("cart", cartSchema);

export default Cart;
import mongoose from "mongoose";
// name, description, logo
// schema , model

const brandSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minLength: 3,
        trim: true,
    },
    description:{
        type: String,
        required: true
    },
    logo:{
        type: String,

    }
},{timestamps: true});

const Brand = mongoose.model("brand", brandSchema);

export default Brand;
// CRUD
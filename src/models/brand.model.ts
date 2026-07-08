import mongoose from "mongoose";
// name, description, logo
// schema , model

const brandSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "name is required"],
        minLength: 3,
        trim: true,
    },
    description:{
        type: String,
        trim: true,
        minLength: 25,
        maxLength: 500,
    },
    logo:{
        type: String,
        trim: true,

    }
},{timestamps: true});

const Brand = mongoose.model("brand", brandSchema);

export default Brand;
// CRUD
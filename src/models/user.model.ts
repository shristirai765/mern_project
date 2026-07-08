import mongoose from "mongoose";
import { Role } from "../types/enum.types";

const userSchema = new mongoose.Schema({
    full_name:{
        type: String,
        required: [true, "full_name is required"],
        minLength: [3, "name must be 3 character long"],
        trim: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        unique: [true, "user already exists with provided email"],
        trim: true
    },
    password:{
        type: String,
        required: [true, "password is required"],
        select: false,
    },
    profile_image:{
        type: String,
    },
    role:{
        type: String,
        enum: Object.values(Role),
        default: "USER",
    },
    phone:{
        type: String,
        required: false,
        maxLength: [10, "phone number at most be 10 ligits long"],
    },
},{timestamps: true});

const User = mongoose.model("user", userSchema);
export default User;
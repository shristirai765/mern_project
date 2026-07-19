"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const image_model_1 = __importDefault(require("./image.model"));
// name, description, logo
// schema , model
const brandSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: 3,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        minLength: 25,
        maxLength: 500,
    },
    logo: {
        type: image_model_1.default,
        required: [true, "logo is required"],
        trim: true,
    }
}, { timestamps: true });
const Brand = mongoose_1.default.model("brand", brandSchema);
exports.default = Brand;
// CRUD

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @types/packagename
//! creating app instance
const app = (0, express_1.default)();
//! using middlewares
//! using routes
//* health route
app.get("/", (req, res, next) => {
    res.status(200).json({
        message: "server is up and running",
        success: true,
        status: "success",
        data: null,
    });
});
//! path not found
app.use((req, res, next) => {
    const message = `Can not ${req.method} on ${req.body}`;
    res.status(404).json({
        message,
        success: false,
        status: "fail",
        data: null
    });
});
exports.default = app;
// dev depen

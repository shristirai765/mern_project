"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishList_controller_1 = require("../controllers/wishList.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/", (0, auth_middleware_1.authenticate)(), wishList_controller_1.Add_Wishlist);
router.get("/", (0, auth_middleware_1.authenticate)(), wishList_controller_1.Get_Wishlist);
router.delete("/:productId", (0, auth_middleware_1.authenticate)(), wishList_controller_1.Remove_Wishlist);
router.delete("/", (0, auth_middleware_1.authenticate)(), wishList_controller_1.Clear_Wishlist);
exports.default = router;

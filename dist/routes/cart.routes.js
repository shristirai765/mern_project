"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
//* Add product to cart
router.post("/", (0, auth_middleware_1.authenticate)(), cart_controller_1.Add_Cart);
//* Get logged-in user's cart
router.get("/", (0, auth_middleware_1.authenticate)(), cart_controller_1.Get_Cart);
//* Update product quantity
router.put("/", (0, auth_middleware_1.authenticate)(), cart_controller_1.Update_Cart);
// *Remove a product from cart
router.delete("/:productId", (0, auth_middleware_1.authenticate)(), cart_controller_1.Remove_Cart);
//* Clear entire cart
router.delete("/", (0, auth_middleware_1.authenticate)(), cart_controller_1.Clear_Cart);
exports.default = router;

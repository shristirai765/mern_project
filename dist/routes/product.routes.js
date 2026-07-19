"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const multer_middleware_1 = require("../middlewares/multer.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const enum_types_1 = require("../types/enum.types");
const router = express_1.default.Router();
const upload = (0, multer_middleware_1.uploader)();
router.get("/", product_controller_1.getAll);
router.get("/new_arrivals", product_controller_1.getNewArrivals);
router.get("/is_featured", product_controller_1.getFeatured);
router.get("/:id", product_controller_1.getById);
router.post("/", upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    }
]), (0, auth_middleware_1.authenticate)(enum_types_1.All_admins), product_controller_1.createProduct);
router.put("/:id", upload.fields([
    {
        name: "cover_image",
        maxCount: 1,
    },
    {
        name: "images",
        maxCount: 5,
    }
]), (0, auth_middleware_1.authenticate)(enum_types_1.All_admins), product_controller_1.update);
router.delete("/:id", (0, auth_middleware_1.authenticate)(enum_types_1.All_admins), product_controller_1.remove);
router.get("/brand/:brandId", product_controller_1.getByBrand);
router.get("/category/:categoryId", product_controller_1.getByCategory);
exports.default = router;

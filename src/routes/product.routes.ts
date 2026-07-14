import express from "express";
import { createProduct, getAll, getById, getNewArrivals, remove, update } from "../controllers/product.controller";
import { uploader } from "../middlewares/multer.middleware";


const router = express.Router();
const upload = uploader();


router.get("/", getAll);

router.get("/:id", getById);

router.post("/",upload.single("product_picture"), createProduct);

router.put("/:id",upload.single("product_picture"), update);

router.delete("/:id", remove);

router.get("/filter", getNewArrivals);

export default router;
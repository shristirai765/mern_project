import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import brandRoutes from "./brand.routes";
import productRoutes from "./product.routes";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/brands", brandRoutes);
router.use("/categories", categoryRoutes);
router.use("/products", productRoutes);



export default router;
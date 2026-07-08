import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import brandRoutes from "./brand.routes";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/users", brandRoutes);
router.use("/users", categoryRoutes);



export default router;
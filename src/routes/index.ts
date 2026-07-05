import express from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./auth.routes";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);


export default router;
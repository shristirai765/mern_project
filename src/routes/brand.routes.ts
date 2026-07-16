import express from "express";
import {
  createBrand,
  remove,
  getAll,
  getById,
  update,
} from "../controllers/brand.controller";
import { uploader } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { All_admins} from "../types/enum.types";


const upload = uploader();

const router = express.Router();

// getAll
router.get("/", getAll);

// getById
router.get("/:id", getById);

// create
router.post("/", upload.single("logo"),authenticate(All_admins), createBrand);

// update
router.put("/:id",upload.single("logo"), authenticate(All_admins), update);

// delete
router.delete("/:id",authenticate(All_admins), remove);

export default router;

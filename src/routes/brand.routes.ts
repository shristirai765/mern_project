import express from "express";
import {
  createBrand,
  remove,
  getAll,
  getById,
  update,
} from "../controllers/brand.controller";
import { uploader } from "../middlewares/multer.middleware";


const upload = uploader();

const router = express.Router();

// getAll
router.get("/", getAll);

// getById
router.get("/:id", getById);

// create
router.post("/", upload.single("logo"), createBrand);

// update
router.put("/:id",upload.single("logo"), update);

// delete
router.delete("/:id", remove);

export default router;

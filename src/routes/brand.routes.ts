import express from "express";
import {
  createBrand,
  remove,
  getAll,
  getById,
  update,
} from "../controllers/brand.controller";

const router = express.Router();

// getAll
router.get("/", getAll);

// getById
router.get("/:id", getById);

// create
router.post("/", createBrand);

// update
router.put("/:id", update);

// delete
router.delete("/:id", remove);

export default router;

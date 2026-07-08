import express from "express";
import {
  create,
  deleteBrand,
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
router.post("/", create);

// update
router.put("/:id", update);

// delete
router.delete("/:id", deleteBrand);

export default router;

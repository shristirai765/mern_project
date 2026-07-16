import express from "express";
import {getAll, getAllAdmins, getById, remove} from "../controllers/user.controller";

const router = express.Router();

//* get All
router.get("/", getAll);

//* get all admins
router.get("/admins", getAllAdmins);

//* get by id
router.get("/:id", getById);

//* delete
router.delete("/:id", remove);

export default router;
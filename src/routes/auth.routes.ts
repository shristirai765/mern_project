import express from "express";
import { register, login } from "../controllers/auth.controller";
import {getAll, getAllAdmins, getById} from "../controllers/user.controller";

const router = express.Router();

//* register
router.post("/register", register);

//* login
router.post("/login", login);

//* get All
router.get("/getAll", getAll);

//* get all admins
router.get("/getAllAdmins", getAllAdmins);

//* get by id
router.get("/getById", getById);

export default router;
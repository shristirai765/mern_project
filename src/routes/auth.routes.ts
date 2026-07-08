import express from "express";
import { register, login } from "../controllers/auth.controller";
import { uploader } from "../middlewares/multer.middleware";


const router = express.Router();

const upload = uploader();

//* register
router.post("/register", upload.single("profile_image"), register);

//* login
router.post("/login", login);



export default router;
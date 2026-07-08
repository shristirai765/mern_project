import express from "express";
import { register, login } from "../controllers/auth.controller";
import multer from "multer";

const router = express.Router();

//* multer disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const folder = 'uploads/';
        cb(null, folder);
    },
    filename: (req, file, cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix+ "-"+ file.originalname);
    },
});

//* multer upload instance
const upload = multer({storage: storage});

//* register
router.post("/register", upload.single("profile_image"), register);

//* login
router.post("/login", login);



export default router;
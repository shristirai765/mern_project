import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
} from "../controllers/category.controller";
import { uploader } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/auth.middleware";
import { All_admins } from "../types/enum.types";

const router = express.Router();
const upload = uploader();

//* get all category
router.get("/", getAll);

//* get by id
router.get("/:id", getById);

//* create/post
router.post("/",upload.single("logo"), authenticate(All_admins), create);

//* update/put
router.put("/:id",upload.single("logo"),authenticate(All_admins), update);

//* delete
router.delete("/:id",authenticate(All_admins), remove);

export default router;

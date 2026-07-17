import express  from "express";
import {
  Add_Wishlist,
  Get_Wishlist,
  Remove_Wishlist,
  Clear_Wishlist,
} from "../controllers/wishList.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/", authenticate(), Add_Wishlist);
router.get("/", authenticate(), Get_Wishlist);
router.delete("/:productId", authenticate(), Remove_Wishlist);
router.delete("/", authenticate(), Clear_Wishlist);

export default router;
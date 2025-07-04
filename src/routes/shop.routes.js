import { Router } from "express";
import {
  registerShop,
  loginShop,
  getCurrentShop,
  logOutShop,
} from "../controllers/shop.controller.js";
import { verifyJWT } from "../middlewares/shop.auth.middleware.js";
import { upload } from "../middlewares/multer.middlware.js";

const router = Router();

router.route("/register-shop").post(upload.single("avatar"), registerShop);
router.route("/login-shop").post(loginShop);
router.route("/get-current-shop").get(verifyJWT, getCurrentShop);
router.route("/logout").post(verifyJWT, logOutShop);
export default router;

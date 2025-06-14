import { Router } from "express";
import { registerShop } from "../controllers/shop.controller.js";

const router = Router();

router.route("/register-shop").post(registerShop);

export default router;

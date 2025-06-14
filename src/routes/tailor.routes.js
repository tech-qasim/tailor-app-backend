import { Router } from "express";
import { registerTailor } from "../controllers/tailor.controller.js";

const router = Router();

router.route("/register-tailor").post(registerTailor);

export default router;

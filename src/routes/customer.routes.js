import { Router } from "express";
import { registerCustomer } from "../controllers/customer.controller.js";

const router = Router();

router.route("/register-customer").post(registerCustomer);

export default router;

import { Router } from "express";
import { createCustomerMeasurement } from "../controllers/customer_measurement.controller.js";

const router = Router();

router.route("/create-customer-measurement").post(createCustomerMeasurement);

export default router;

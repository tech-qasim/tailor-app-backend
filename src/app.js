import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import shopRouter from "./routes/shop.routes.js";
import customerRouter from "./routes/customer.routes.js";
import tailorRouter from "./routes/tailor.routes.js";
import customerMeasurementRouter from "./routes/customer_measurement.routes.js";
import orderRouter from "./routes/order.routes.js";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/shops", shopRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/tailors", tailorRouter);
app.use("/api/v1/customer-measurements", customerMeasurementRouter);
app.use("/api/v1/orders", orderRouter);

export { app };

import mongoose, { Schema } from "mongoose";

const measurementSchema = Schema({
  chestLength: { type: Number, default: 0 },
  hemlineLength: { type: Number, default: 0 },
  kameezLength: { type: Number, default: 0 },
  loosingLength: { type: Number, default: 0 },
  neckLength: { type: Number, default: 0 },
  openLegsLength: { type: Number, default: 0 },
  shalwarLength: { type: Number, default: 0 },
  widthLength: { type: Number, default: 0 },
});

const customerMeasurementSchema = Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    default: "male",
    required: true,
  },
  measurementType: {
    type: String,
    enum: ["shalwar-kameez", "pant-shirt", "others"],
    default: "shalwar-kameez",
    required: true,
  },
  shopID: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  shopName: {
    type: String,
  },
  measurement: measurementSchema,
});

export const CustomerMeasurement = mongoose.model(
  "CustomerMeasurement",
  customerMeasurementSchema
);

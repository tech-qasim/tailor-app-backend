import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    amountPerSuit: {
      type: Number,
      required: true,
    },
    assignedTailorID: {
      type: Schema.Types.ObjectId,
      ref: "Tailor",
    },
    assignedTailorName: {
      type: String,
    },
    customerID: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    isUrgent: {
      type: Boolean,
      required: true,
      default: false,
    },
    measurementID: {
      type: Schema.Types.ObjectId,
      ref: "CustomerMeasurement",
    },
    measurementType: {
      type: String,
    },
    numberOfSuits: {
      type: Number,
      required: true,
    },
    orderDeliveryDate: {
      type: Date,
      required: true,
    },
    orderReminderDate: {
      type: Date,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
      required: true,
    },
    shopID: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    shopName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);

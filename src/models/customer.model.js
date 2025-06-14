import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      unique: true,
      required: true,
    },
    customerPhoneNumber: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    shopID: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    customerAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Customer = mongoose.model("Customer", customerSchema);

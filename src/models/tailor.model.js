import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const tailorSchema = new Schema(
  {
    tailorName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    tailorEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tailorAddress: {
      type: String,
      required: true,
      trim: true,
    },
    tailorPhoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    shopID: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    shopName: {
      type: String,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

tailorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

tailorSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

tailorSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      tailorEmail: this.tailorName,
      tailorAddress: this.tailorAddress,
      tailorName: this.tailorName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
tailorSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const Tailor = mongoose.model("Tailor", tailorSchema);

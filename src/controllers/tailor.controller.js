import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Shop } from "../models/tailor.model.js"; // Assuming this is your tailor model

const registerTailor = asyncHandler(async (req, res) => {
  const {
    tailorName,
    tailorEmail,
    tailorPhoneNumber,
    tailorAddress,
    shopID,
    shopName,
    password,
  } = req.body;

  if (
    [
      tailorName,
      tailorEmail,
      tailorPhoneNumber,
      tailorAddress,
      shopID,
      password,
    ].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existingTailor = await Shop.findOne({
    $or: [{ tailorEmail }, { tailorPhoneNumber }],
  });

  if (existingTailor) {
    throw new ApiError(409, "Tailor with phone number or email already exists");
  }

  const tailor = await Shop.create({
    tailorName,
    tailorEmail,
    tailorPhoneNumber,
    tailorAddress,
    shopID,
    shopName,
    password,
  });

  const createdTailor = await Shop.findById(tailor._id).select("-password");

  if (!createdTailor) {
    throw new ApiError(
      500,
      "Something went wrong while registering the tailor"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdTailor, "Tailor Registered Successfully")
    );
});

const getTailors = asyncHandler(async (req, res) => {
  const tailors = await Shop.find().select("-password");

  if (!tailors || tailors.length === 0) {
    throw new ApiError(404, "No tailors found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tailors, "Tailors fetched successfully"));
});

const getTailorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tailor = await Shop.findById(id).select("-password");

  if (!tailor) {
    throw new ApiError(404, "Tailor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tailor, "Tailor fetched successfully"));
});

export { registerTailor, getTailors, getTailorById };

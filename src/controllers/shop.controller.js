import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Shop } from "../models/shop.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerShop = asyncHandler(async (req, res) => {
  const { shopName, shopAddress, shopPhoneNo, shopEmail, password } = req.body;

  if (
    [shopName, shopAddress, shopPhoneNo, shopEmail, password].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedShop = await Shop.findOne({
    $or: [{ shopPhoneNo }, { shopEmail }],
  });

  if (existedShop) {
    throw new ApiError(
      409,
      "Shop with this email or phone number already exists"
    );
  }

  //   const avatarLocalPath = req.files?.avatar[0]?.path;
  //   // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  //   let coverImageLocalPath;
  //   if (
  //     req.files &&
  //     Array.isArray(req.files.coverImage) &&
  //     req.files.coverImage.length > 0
  //   ) {
  //     coverImageLocalPath = req.files.coverImage[0].path;
  //   }

  //   console.log(res.files);

  //   if (!avatarLocalPath) {
  //     throw new ApiError(400, "Avatar is required");
  //   }

  //   const avatar = await uploadOnCloudinary(avatarLocalPath);
  //   const coverImage = coverImageLocalPath
  //     ? await uploadOnCloudinary(coverImageLocalPath)
  //     : null;

  //   if (!avatar) {
  //     console.log(avatarLocalPath);
  //     throw new ApiError(400, "Failed to upload avatar");
  //   }

  const shop = await Shop.create({
    shopName: shopName,
    email: shopEmail, // Maps to the 'email' field in the schema
    shopAddress: shopAddress,
    shopPhoneNo: shopPhoneNo,
    password: password,
  });

  const createdShop = await Shop.findById(shop._id).select(
    "-password -refreshToken"
  );

  if (!createdShop) {
    throw new ApiError(500, "Shop registration failed. Please try again.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdShop, "Shop registered successfully"));
});

export { registerShop };

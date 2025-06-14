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

const generateAccessTokenAndRefreshTokens = async (shopID) => {
  try {
    const shop = await Shop.findById(shopID);
    const accessToken = shop.generateAccessToken();
    const refreshToken = shop.generateRefreshToken();

    shop.refreshToken = refreshToken;
    await shop.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (e) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
      e
    );
  }
};

const getCurrentShop = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const loginShop = asyncHandler(async (req, res) => {
  //req body -> data
  // username or email
  // find the user
  // password check
  //access and refresh token
  //send cookie

  const { shopEmail, shopPhoneNumber, password } = req.body;

  if (!shopEmail && !shopPhoneNumber) {
    throw new ApiError(400, "shop email or phone number is required");
  }

  const shop = await Shop.findOne({
    $or: [{ shopEmail }, { shopPhoneNumber }],
  });

  if (!shop) {
    throw new ApiError(404, "Shop does not exist");
  }

  const isPasswordCorrect = await shop.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshTokens(shop._id);

  const loggedInUser = await Shop.findById(shop._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "Shop logged In Successfully"
      )
    );
});

export {
  registerShop,
  generateAccessTokenAndRefreshTokens,
  loginShop,
  getCurrentShop,
};

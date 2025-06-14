import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tailor } from "../models/tailor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

  const existingTailor = await Tailor.findOne({
    $or: [{ tailorEmail }, { tailorPhoneNumber }],
  });

  if (existingTailor) {
    throw new ApiError(409, "Tailor with phone number or email already exists");
  }

  const avatarLocalPath = req.file?.path;

  const avatar = (await avatarLocalPath)
    ? await uploadOnCloudinary(avatarLocalPath)
    : null;

  if (!avatar) {
    console.log(avatarLocalPath);
    // throw new ApiError(400, "Failed to upload avatar");
  }

  const tailor = await Tailor.create({
    tailorName,
    tailorEmail,
    tailorPhoneNumber,
    tailorAddress,
    shopID,
    shopName,
    password,
    avatar: avatar?.url || "",
  });

  const createdTailor = await Tailor.findById(tailor._id).select("-password");

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
  const tailors = await Tailor.find().select("-password");

  if (!tailors || tailors.length === 0) {
    throw new ApiError(404, "No tailors found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tailors, "Tailors fetched successfully"));
});

const getTailorById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const tailor = await Tailor.findById(id).select("-password");

  if (!tailor) {
    throw new ApiError(404, "Tailor not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tailor, "Tailor fetched successfully"));
});

const loginTailor = asyncHandler(async (req, res) => {
  //req body -> data
  // username or email
  // find the user
  // password check
  //access and refresh token
  //send cookie

  const { tailorEmail, tailorPhoneNumber, password } = req.body;

  if (!tailorEmail && !tailorPhoneNumber) {
    throw new ApiError(400, "shop email or phone number is required");
  }

  const tailor = await Tailor.findOne({
    $or: [{ tailorEmail }, { tailorPhoneNumber }],
  });

  if (!tailor) {
    throw new ApiError(404, "Shop does not exist");
  }

  const isPasswordCorrect = await tailor.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshTokens(tailor._id);

  const loggedInUser = await Tailor.findById(tailor._id).select(
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

const generateAccessTokenAndRefreshTokens = async (shopID) => {
  try {
    const tailor = await Tailor.findById(shopID);
    const accessToken = tailor.generateAccessToken();
    const refreshToken = tailor.generateRefreshToken();

    tailor.refreshToken = refreshToken;
    await tailor.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (e) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token",
      e
    );
  }
};

const getCurrentTailor = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User fetched successfully"));
});

const logOutTailor = asyncHandler(async (req, res) => {
  await Tailor.findOneAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

export {
  registerTailor,
  getTailors,
  getTailorById,
  loginTailor,
  generateAccessTokenAndRefreshTokens,
  logOutTailor,
  getCurrentTailor,
};

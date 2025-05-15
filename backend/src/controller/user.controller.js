import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessTokenandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validationBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(501, "error creating access an drefresh tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);

  const { username, email, password, role } = req.body;

  if ([username, email, password, role].some((field) => field.trim() === "")) {
    throw new ApiError(403, "All fields are required");
  }

  const allowedRoles = ["admin", "author", "reader"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role specified");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(402, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  console.log("avatarLocalPath:", avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(402, "The avatar does not exist in local path");
  }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("uploadOnCloudinary response:", avatar);
    if (!avatar) {
      throw new ApiError(402, "Avatar upload failed");
    }
  } catch (error) {
    console.error("Error uploading avatar to Cloudinary:", error);
    throw new ApiError(500, "Failed to upload avatar");
  }

  const user = await User.create({
    username: username.toLowerCase(),
    avatar: avatar.url,
    email,
    password,
    role,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User created successfully"));
});

export { registerUser };

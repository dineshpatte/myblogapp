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

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(409, "either email or username is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(402, "invalid credentials");
  }
  const isPassswordValid = await user.isPasswordCorrect(password);
  if (!isPassswordValid) {
    throw new ApiError(402, "invalid password");
  }
  console.log("password match:", isPassswordValid);

  const { refreshToken, accessToken } =
    await generateAccessTokenandRefreshToken(user._id);

  console.log(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!loggedInUser) {
    throw new ApiError(402, "user not available");
  }

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
        { user: loggedInUser, refreshToken, accessToken },
        "login sucessfull"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,

    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "logoutsuccessfull"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }
  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,

      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedRefreshToken._id);

    if (!user) {
      throw new ApiError(401, "invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "refresh token is expired or alreaady used");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessTokenandRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken:", accessToken, options)
      .cookie("refreshToken:", newRefreshToken, options)
      .json(
        new ApiResponse(
          (200,
          { accessToken, refreshToken: newRefreshToken },
          "access token refreshed")
        )
      );
  } catch (error) {
    throw new ApiError(401, "invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log(oldPassword);
  console.log(newPassword);

  const user = await User.findById(req.user?._id);

  if (!(oldPassword || newPassword)) {
    throw new ApiError(402, "please provide both password");
  }

  const isPassswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPassswordValid) {
    throw new ApiError(402, "pleas enter teh correct passowrd");
  }

  user.password = newPassword;
  user.save({ validationBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, "password upadted"));
});
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!(username || email)) {
    throw new ApiError(404, "both emai and fullane are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { username, email: email } },
    { new: true }
  ).select("-password");

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user,
      },
      "Account details updated successfully"
    )
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  updateAccountDetails,
};

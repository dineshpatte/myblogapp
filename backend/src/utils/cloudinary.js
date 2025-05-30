import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Delete temp file after upload
    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkErr) {
      console.error("Failed to delete temp file:", unlinkErr);
    }

    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkErr) {
      console.error(
        "Failed to delete temp file after upload error:",
        unlinkErr
      );
    }

    return null;
  }
};

export { uploadOnCloudinary };

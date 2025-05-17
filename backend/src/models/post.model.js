import mongoose, { Schema } from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "draft",
    },
    thumbnail: {
      type: String, // Cloudinary image URL
      default: "",
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);

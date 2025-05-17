import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
  const { title, content, status } = req.body;
  console.log(req.file);

  if (!title || !content) {
    throw new ApiError(402, "Both title and content are required");
  }

  const author = req.user?._id;
  if (!author) {
    throw new ApiError(403, "Please login");
  }

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  console.log("thumbnailLocalPath:", thumbnailLocalPath);

  if (!thumbnailLocalPath) {
    throw new ApiError(404, "The thumbnail does not exist in local path");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail) {
    throw new ApiError(404, "thumbnail has not been uploaded");
  }
  const post = await Post.create({
    title,
    content,
    status,
    author,
    thumbnail: thumbnail.url,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post created successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status) filter.status = status;

  const posts = await Post.find(filter)
    .populate("author", "username email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Post.countDocuments(filter);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { posts, total, page: Number(page), limit: Number(limit) },
        "posts fetched sucessfullu"
      )
    );
});

const getPostById = asyncHandler(async (req, res) => {
  const author = req.user?._id;
  if (!author) {
    throw new ApiError(402, "please login");
  }

  const posts = await Post.find({ author });

  if (!posts) {
    throw new ApiError(402, "posts are not been able to fetch");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "posts of id fetched sucessfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const { postId } = req.params;
  //   const authorId = req.user?._id;
  //   console.log({ author: authorId });
  console.log(postId);
  if (!(title || content)) {
    throw new ApiError(400, "Please provide title or content to update.");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  console.log(post);

  //   if (req.user.role === "reader") {
  //     throw new ApiError(403, "Readers are not authorized to update posts");
  //   }

  //   if (post.author.toString() !== authorId && req.user?.role !== "admin") {
  //     throw new ApiError(403, "You are not authorized to update this post");
  //   }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this post");
  }

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $set: { ...(title && { title }), ...(content && { content }) } },
    { new: true }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  //   const authorId = req.user?._id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  //   if (req.user.role === "reader") {
  //     throw new ApiError(403, "Readers are not authorized to update posts");
  //   }

  //   if (post.author.toString() !== authorId && req.user?.role !== "admin") {
  //     throw new ApiError(403, "You are not authorized to delete this post");
  //   }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this post");
  }

  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

export { createPost, getAllPosts, getPostById, updatePost, deletePost };

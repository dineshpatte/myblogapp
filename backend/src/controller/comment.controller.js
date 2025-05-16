import { Comment } from "../models/comment.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

const addComment = asyncHandler(async (req, res) => {
  const { content, postId } = req.body;
  const commenter = req.user?._id;

  if (!content || !postId) {
    throw new ApiError(400, "Content and Post ID are required");
  }

  const comment = await Comment.create({
    content,
    post: postId,
    commenter,
  });

  res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

const getCommentsByPost = asyncHandler(async (req, res) => {
  const { post } = req.params;

  if (!post) {
    throw new ApiError(400, "Post ID is required");
  }

  const comments = await Comment.find({ post }).populate(
    "commenter",
    "username"
  );

  res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findById(id);

  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.commenter.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully"));
});

export { addComment, deleteComment, getCommentsByPost };

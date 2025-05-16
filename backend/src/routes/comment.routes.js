import express from "express";
import {
  addComment,
  getCommentsByPost,
  deleteComment,
} from "../controller/comment.controller.js";
import { verifyJWT } from "../middleswares/auth.middleware.js";

const router = express.Router();

router.post("/addcomment", verifyJWT, addComment);
router.get("/getcommentsbypost/:post", getCommentsByPost);
router.delete("/deletecomment/:id", verifyJWT, deleteComment);

export default router;

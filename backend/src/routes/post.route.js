import Router from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controller/post.controller.js";
import { verifyJWT } from "../middleswares/auth.middleware.js";
import { upload } from "../middleswares/multer.middleware.js";

const router = Router();

router
  .route("/createpost")
  .post(
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    verifyJWT,
    createPost
  );

router.route("/getallposts").get(verifyJWT, getAllPosts);
router.route("/getpostbyuserid").get(verifyJWT, getPostById);
router.put("/updatepost/:postId", verifyJWT, updatePost);
router.delete("/deletepost/:postId", verifyJWT, deletePost);

export default router;

import { registerUser } from "../controller/user.controller.js";
import { Router } from "express";
import { upload } from "../middleswares/multer.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

export default router;

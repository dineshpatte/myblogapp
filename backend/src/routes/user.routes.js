import {
  changeCurrentPassword,
  loginUser,
  logoutUser,
  registerUser,
  updateAccountDetails,
} from "../controller/user.controller.js";
import { Router } from "express";
import { upload } from "../middleswares/multer.middleware.js";

import { verifyJWT } from "../middleswares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/changepassword").post(verifyJWT, changeCurrentPassword);
router.route("/updatedetails").post(verifyJWT, updateAccountDetails);

export default router;

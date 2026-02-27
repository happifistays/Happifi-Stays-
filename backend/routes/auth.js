import express from "express";
import {
  sendEmailOTP, 
  sendOTP,
  signUp,
  verifyOTPAndSignUp,
} from "../controllers/signUp.js";
import { sigIn } from "../controllers/signin.js";
import { getMe } from "../controllers/getMe.js";
import { googleLogin } from "../controllers/authController.js";

import { updateProfile } from "../controllers/shops/updateProfile.js";

import { userVerification } from "../middleware/AuthMiddleware.js";
import { getProfile } from "../controllers/common/getProfile.js";
import { updateEmail } from "../controllers/common/updateEmail.js";
import { updatePassword } from "../controllers/common/updatePassword.js";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { addContact } from "../controllers/addContact.js";
import { getContacts } from "../controllers/shops/getContacts.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", sigIn);
authRouter.post("/google-login", googleLogin);
authRouter.get("/me", getMe);
authRouter.patch("/profile", userVerification, updateProfile);

authRouter.post("/send-otp", sendOTP);
authRouter.post("/verify-otp", verifyOTPAndSignUp);
authRouter.get("/profile", userVerification, getProfile);

authRouter.post("/send-email-otp", userVerification, sendEmailOTP);

authRouter.patch("/update/email", userVerification, updateEmail);
authRouter.patch("/update/password", userVerification, updatePassword);

authRouter.post(
  "/verify-current-password",
  userVerification,
  async (req, res) => {
    try {
      const { password } = req.body;
      const user = await User.findById(req.userId);
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect password" });
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

authRouter.post("/send-message", addContact);
authRouter.get("/contacts", getContacts);

export default authRouter;

// export default router;

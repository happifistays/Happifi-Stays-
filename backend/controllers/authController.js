import { googleLoginService } from "../services/authService.js";
import { createSecretToken } from "../utils/utils.js";
import dotenv from "dotenv";
dotenv.config();

export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token required" });
    }

    const user = await googleLoginService(idToken);

    const token = createSecretToken(user._id);

    // Removed res.cookie logic

    let loggedInUser = user.toObject ? user.toObject() : user;
    loggedInUser["token"] = token;

    res.status(201).json({
      status: 200,
      message: "User logged in successfully",
      success: true,
      user: loggedInUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { createSecretToken } from "../utils/utils.js";
import dotenv from "dotenv";
dotenv.config();

export const sigIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ status: 400, message: "Incorrect password or email" });
    }

    if (!user.password) {
      return res.status(400).json({
        message:
          "This account was created using Google. Please log in with Google.",
      });
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return res
        .status(400)
        .json({ status: 400, message: "Incorrect password or email" });
    }

    const token = createSecretToken(user._id);

    // Removed res.cookie logic

    let loggedInUser = user.toObject(); // Convert to plain object to modify
    loggedInUser["token"] = token;

    res.status(201).json({
      status: 200,
      message: "User logged in successfully",
      success: true,
      user: loggedInUser,
      token,
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

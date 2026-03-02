import User from "../../models/userSchema.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (req.body.avatar) {
      const base64Data = req.body.avatar.includes("base64,")
        ? req.body.avatar.split("base64,")[1]
        : req.body.avatar;

      const sizeInBytes = Buffer.byteLength(base64Data, "base64");

      if (sizeInBytes > 1 * 1024) {
        return res.status(400).send({
          success: false,
          message: "Avatar size must be less than 500KB",
        });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const updateData = {
      name: req.body.name,
      contactNumber: req.body.contactNumber,
      location: req.body.location,
      birthday: req.body.birthday,
      avatar: req.body.avatar,
    };

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    await User.updateOne({ _id: userId }, { $set: updateData });

    res.status(200).send({ success: true, message: "Profile updated" });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

import Contacts from "../models/contactSchema.js";

export const addContact = async (req, res) => {
  try {
    await Contacts.create({
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Contactss created successfully",
    });
  } catch (error) {
    console.log("1111111111111");
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

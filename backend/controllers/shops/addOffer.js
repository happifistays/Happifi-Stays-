import Offers from "../../models/offerSchema.js";

export const addOffer = async (req, res) => {
  try {
    const offer = await Offers.create({
      ...req.body,
      shopId: req.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

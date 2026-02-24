import Offers from "../models/offerSchema.js";

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offers.find();

    return res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

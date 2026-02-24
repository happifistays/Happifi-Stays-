import Offers from "../../models/offerSchema.js";

export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offers.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer",
      data: offer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

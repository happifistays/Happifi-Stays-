import Offers from "../../models/offerSchema.js";
import Property from "../../models/propertySchema.js";

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await Offers.findByIdAndDelete(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    await Property.updateMany(
      { availableOffers: id },
      { $pull: { availableOffers: id } }
    );

    return res.status(200).json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

import Offers from "../../models/offerSchema.js";
import Property from "../../models/propertySchema.js"; // Ensure this is imported

export const editOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { appliedProperties, ...updateData } = req.body;

    // 1. Update the Offer document
    const updatedOffer = await Offers.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updateData,
          // Ensure appliedProperties is included in the set if provided
          ...(appliedProperties && { appliedProperties }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // 2. Sync Property associations if appliedProperties were sent in the request
    if (appliedProperties) {
      // Step A: Remove this Offer ID from ANY property that currently has it
      await Property.updateMany(
        { availableOffers: id },
        { $pull: { availableOffers: id } }
      );

      // Step B: Add this Offer ID to the properties currently selected
      if (appliedProperties.length > 0) {
        await Property.updateMany(
          { _id: { $in: appliedProperties } },
          { $addToSet: { availableOffers: id } }
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      data: updatedOffer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

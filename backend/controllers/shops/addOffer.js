import Offers from "../../models/offerSchema.js";
import Property from "../../models/propertySchema.js";

export const addOffer = async (req, res) => {
  try {
    const { appliedProperties, ...rest } = req.body;

    const offer = await Offers.create({
      ...rest,
      appliedProperties: appliedProperties || [],
      shopId: req.userId,
    });

    // If properties were selected, update them to include this offer
    if (appliedProperties && appliedProperties.length > 0) {
      await Property.updateMany(
        { _id: { $in: appliedProperties } },
        { $addToSet: { availableOffers: offer._id } }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Offer created successfully",
      offer,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

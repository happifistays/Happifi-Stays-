import Property from "../../models/propertySchema.js";
import Bookings from "../../models/bookings.js";
import Stats from "../../models/statsSchema.js";

export const getListingsCount = async (req, res) => {
  try {
    const shopId = req.userId;

    // 1. Get unique property IDs that have an active reservation status
    // This counts a property as 'booked' if it is currently reserved or occupied
    const bookedPropertyIds = await Bookings.distinct("propertyId", {
      shopId: shopId,
      status: { $in: ["booked", "checked_in"] },
    });

    const bookedProperties = bookedPropertyIds.length;

    // 2. Fetch total listings and stats in parallel
    const [totalListings, shopStats] = await Promise.all([
      Property.countDocuments({ owner: shopId }),
      Stats.findOne({ shopId: shopId }),
    ]);

    // 3. Calculate available properties (Total - Booked)
    const availableProperties = Math.max(0, totalListings - bookedProperties);

    return res.status(200).send({
      success: true,
      data: {
        availableProperties,
        earnings: shopStats ? shopStats.earnings : 0,
        bookedProperties,
        totalListings,
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

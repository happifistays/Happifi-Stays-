import Contacts from "../../models/contactSchema.js";
import Stats from "../../models/statsSchema.js";

export const getStats = async (req, res) => {
  try {
    const shopId = req.userId;

    let stats = await Stats.findOne({ shopId });
    const contactCount = await Contacts.countDocuments();

    if (!stats) {
      stats = await Stats.create({
        shopId,
        listings: 0,
        earnings: 0,
        visitors: 0,
        reviews: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ...stats.toObject(),
        leads: contactCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

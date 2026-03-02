import Property from "../../models/propertySchema.js";

export const getPropertiesName = async (req, res) => {
  try {
    const shopId = req.userId;
    const { search = "" } = req.query;

    const query = { owner: shopId };

    if (search) {
      query.listingName = { $regex: search, $options: "i" };
    }

    const properties = await Property.find(query)
      .select("_id listingName availableOffers")
      .sort({ listingName: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: properties,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

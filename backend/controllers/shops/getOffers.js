import Offers from "../../models/offerSchema.js";

export const getOffers = async (req, res) => {
  try {
    let shopId = req.userId;
    const { page = 1, limit = 10, sort, title, ...filters } = req.query;

    const query = { ...filters };

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (shopId) {
      query.shopId = shopId;
    }

    let sortOption = { createdAt: -1 };
    if (sort) {
      const parts = sort.split(":");
      sortOption[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      Offers.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate("shopId", "name email"),
      Offers.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      count: data.length,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

import Room from "../../models/roomSchema.js";
import Rating from "../../models/reviewsSchema.js";
import Property from "../../models/propertySchema.js";

export const getReviews = async (req, res) => {
  try {
    const shopId = req.user.id;
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const ratingFilter = req.query.rating; // optional rating filter (1-5)
 
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 1. Get all rooms belonging to this shop
    const shopProperties = await Property.find({ owner: shopId }).select("_id");
    const propertyIds = shopProperties.map((property) => property._id);
    console.log("propertyIds--------------", propertyIds);
    // 2. Base Query
    const query = { propertyId: { $in: propertyIds } };
    if (ratingFilter) {
      query.rating = Number(ratingFilter);
    }

    // // 3. Stats Aggregation (Keep this for the top widgets)
    const stats = await Rating.aggregate([
      { $match: { propertyId: { $in: propertyIds } } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          newReviews: {
            $sum: {
              $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
            },
          },
        },
      },
    ]);

    // // 4. Paginated Reviews
    const totalReviewsCount = await Rating.countDocuments(query);
    const reviews = await Rating.find(query)
      .populate("propertyId", "listingName gallery")
      //   .populate("roomId", "roomName roomThumbnail price")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const result = {
      success: true,
      totalReviews: stats[0]?.totalReviews || 0,
      averageRating: stats[0]?.averageRating?.toFixed(1) || 0,
      newReviewsCount: stats[0]?.newReviews || 0,
      pagination: {
        totalItems: totalReviewsCount,
        currentPage: page,
        totalPages: Math.ceil(totalReviewsCount / limit),
        limit: limit,
      },
      reviews,
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

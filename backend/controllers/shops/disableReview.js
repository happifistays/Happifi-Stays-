import Rating from "../../models/reviewsSchema.js";

export const disableReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Rating.findById(reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    review.isActive = !review.isActive;
    await review.save();

    return res.status(200).json({
      success: true,
      message: `Review ${review.isActive ? "enabled" : "disabled"}`,
      isActive: review.isActive,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

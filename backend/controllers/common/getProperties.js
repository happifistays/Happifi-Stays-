import mongoose from "mongoose";
import Property from "../../models/propertySchema.js";
import Rating from "../../models/reviewsSchema.js";
import Room from "../../models/roomSchema.js";
import Offers from "../../models/offerSchema.js";

export const getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      city,
      minPrice,
      maxPrice,
      rating,
      amenities,
      isDisabled,
    } = req.query;

    const query = {};

    if (search) {
      query.listingName = { $regex: search, $options: "i" };
    }

    if (isDisabled !== undefined) {
      query.isDisabled = isDisabled === "true";
    }

    if (type) {
      query.listingType = type;
    }

    if (city) {
      query["location.city"] = { $regex: city, $options: "i" };
    }

    if (rating) {
      query.starRating = Number(rating);
    }

    if (minPrice || maxPrice) {
      query.basePrice = {};
      if (minPrice) query.basePrice.$gte = Number(minPrice);
      if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenityList = amenities.split(",");
      query.amenities = { $all: amenityList };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const totalResults = await Property.countDocuments(query);

    const propertyIds = properties.map((p) => p._id);
    const ownerIds = properties.map((p) => p.owner);
    const allOfferIds = properties.flatMap((p) => p.availableOffers || []);

    const [rooms, ratingsData, offers] = await Promise.all([
      Room.find({ property: { $in: propertyIds } }).lean(),
      Rating.aggregate([
        { $match: { toId: { $in: ownerIds } } },
        {
          $group: {
            _id: "$toId",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ]),
      Offers.find({ _id: { $in: allOfferIds } }).lean(),
    ]);

    const ratingsMap = ratingsData.reduce((acc, curr) => {
      acc[curr._id.toString()] = {
        averageRating: Number(curr.averageRating.toFixed(1)),
        reviewCount: curr.reviewCount,
      };
      return acc;
    }, {});

    const offersMap = offers.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr;
      return acc;
    }, {});

    const data = properties.map((property) => {
      const ownerRating = ratingsMap[property.owner.toString()] || {
        averageRating: 0,
        reviewCount: 0,
      };

      const propertyOffers = (property.availableOffers || [])
        .map((id) => offersMap[id.toString()])
        .filter(Boolean);

      return {
        ...property,
        averageRating: ownerRating.averageRating,
        reviewCount: ownerRating.reviewCount,
        availableOffers: propertyOffers,
        rooms: rooms.filter(
          (room) => room.property.toString() === property._id.toString()
        ),
      };
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      totalResults,
      totalPages: Math.ceil(totalResults / limit),
      currentPage: Number(page),
      data,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    const property = await Property.findById(propertyId)
      .populate("owner", "name email")
      .populate("availableOffers");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch property",
      error: error.message,
    });
  }
};

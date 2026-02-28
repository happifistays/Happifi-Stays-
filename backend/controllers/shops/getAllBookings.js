import Bookings from "../../models/bookings.js";

import { format } from "date-fns";
import Property from "../../models/propertySchema.js";

export const getAllBookings = async (req, res) => {
  try {
    const shopId = req.userId;
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      filter,
      sort,
      search,
    } = req.query;

    const query = { shopId };

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (filter === "upcoming") {
      query.checkInDate = { $gte: new Date() };
    }

    // Handle Search (Searching by property name)
    if (search) {
      const properties = await Property.find({
        listingName: { $regex: search, $options: "i" },
      }).select("_id");
      const propertyIds = properties.map((p) => p._id);
      query.propertyId = { $in: propertyIds };
    }

    // Handle Sorting
    let sortConfig = { createdAt: -1 }; // Default: Newest first
    if (sort === "oldest") {
      sortConfig = { createdAt: 1 };
    } else if (sort === "newest") {
      sortConfig = { createdAt: -1 };
    } else if (filter === "upcoming") {
      sortConfig = { checkInDate: 1 };
    }

    const total = await Bookings.countDocuments(query);

    const bookings = await Bookings.find(query)
      .populate({
        path: "propertyId",
        select: "listingName location",
      })
      .populate({
        path: "paymentId",
        select: "paymentMethod transactionId",
      })
      .populate({
        path: "bookedUserId",
        select: "name email avatar contactNumber",
      })
      .select(
        "checkInDate checkOutDate status paymentStatus roomId totalAmount propertyId paymentId trafficSource utm createdAt"
      )
      .sort(sortConfig)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const data = bookings.map((booking) => ({
      _id: booking._id,
      propertyName: booking.propertyId?.listingName || null,
      propertyId: booking.propertyId?._id || null,
      roomName: booking.roomId?.roomName || null,
      roomId: booking.roomId?._id || null,
      additionalInfo: booking.roomId?.additionalInfo || null,
      checkInDate: booking.checkInDate
        ? format(new Date(booking.checkInDate), "dd MMM yyyy")
        : null,
      checkOutDate: booking.checkOutDate
        ? format(new Date(booking.checkOutDate), "dd MMM yyyy")
        : null,
      totalAmount: booking.totalAmount,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentDetails: booking.paymentId || null,
      trafficSource: booking.trafficSource,
      utm: booking.utm || null,
      customer: booking?.bookedUserId,
      createdAt: booking.createdAt,
    }));

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

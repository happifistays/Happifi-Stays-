import Bookings from "../models/bookings.js";
import User from "../models/userSchema.js";
import Guests from "../models/guests.js";
import Property from "../models/propertySchema.js";

export const getBookingById = async (req, res) => {
  try {
    const booking = await Bookings.findById(req.params.id)
      .populate("bookedUserId", "name email avatar contactNumber")
      .populate("propertyId", "thumbnail listingName");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const guests = await Guests.find({
      bookingId: req.params.id,
    });

    return res.status(200).json({
      success: true,
      data: {
        ...booking.toObject(),
        guests,
        guestCount: guests.length,
      },
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

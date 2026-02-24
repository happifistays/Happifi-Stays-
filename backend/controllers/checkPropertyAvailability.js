import Bookings from "../models/bookings.js";

export const checkPropertyAvailability = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res
        .status(400)
        .json({ success: false, message: "Dates required" });
    }

    const requestedCheckIn = new Date(checkIn);
    const requestedCheckOut = new Date(checkOut);

    const overlappingBooking = await Bookings.findOne({
      propertyId,
      status: { $ne: "cancelled" },
      checkInDate: { $lt: requestedCheckOut },
      checkOutDate: { $gt: requestedCheckIn },
    });

    return res.status(200).json({
      success: true,
      available: !overlappingBooking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

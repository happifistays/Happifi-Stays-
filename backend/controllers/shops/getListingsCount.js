import Property from "../../models/propertySchema.js";
import Bookings from "../../models/bookings.js";
import Stats from "../../models/statsSchema.js";

export const getListingsCount = async (req, res) => {
  try {
    const shopId = req.userId;

    // 1. Define Date Ranges
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59
    );

    // 2. Fetch Current Data (as you had before)
    // Modified: Find properties currently occupied/booked for the current timestamp
    const bookedPropertyIds = await Bookings.distinct("propertyId", {
      shopId: shopId,
      status: { $in: ["booked", "checked_in"] },
      checkInDate: { $lte: now },
      checkOutDate: { $gte: now },
    });

    const [totalListings, shopStats] = await Promise.all([
      Property.countDocuments({ owner: shopId }),
      Stats.findOne({ shopId: shopId }),
    ]);

    // 3. Aggregate Monthly Data for Growth Calculation
    const getMonthlyStats = async (startDate, endDate) => {
      return await Bookings.aggregate([
        {
          $match: {
            shopId: shopId,
            status: { $ne: "cancelled" },
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: null,
            totalEarnings: { $sum: "$totalAmount" },
            bookingCount: { $sum: 1 },
          },
        },
      ]);
    };

    const currentMonthData = await getMonthlyStats(startOfCurrentMonth, now);
    const lastMonthData = await getMonthlyStats(
      startOfLastMonth,
      endOfLastMonth
    );

    // 4. Extract values (default to 0 if no bookings exist for that period)
    const currentMonthEarnings = currentMonthData[0]?.totalEarnings || 0;
    const lastMonthEarnings = lastMonthData[0]?.totalEarnings || 0;

    const currentMonthBookings = currentMonthData[0]?.bookingCount || 0;
    const lastMonthBookings = lastMonthData[0]?.bookingCount || 0;

    // 5. Helper function for percentage calculation
    const calculateGrowth = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0; // 100% growth if started from 0
      return parseFloat((((current - previous) / previous) * 100).toFixed(2));
    };

    const earningsGrowth = calculateGrowth(
      currentMonthEarnings,
      lastMonthEarnings
    );
    const bookingsGrowth = calculateGrowth(
      currentMonthBookings,
      lastMonthBookings
    );

    const availableProperties = Math.max(
      0,
      totalListings - bookedPropertyIds.length
    );

    return res.status(200).send({
      success: true,
      data: {
        availableProperties,
        totalEarnings: shopStats ? shopStats.earnings : 0,
        bookedProperties: bookedPropertyIds.length,
        totalListings,
        growth: {
          earningsPercentage: earningsGrowth, // e.g., 15.5
          bookingsPercentage: bookingsGrowth, // e.g., -5.2
          currentMonthEarnings,
          lastMonthEarnings,
        },
      },
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

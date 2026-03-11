import Contacts from "../../models/contactSchema.js";
import Stats from "../../models/statsSchema.js";
import { startOfMonth, endOfMonth, subMonths, parse } from "date-fns";
import Bookings from "../../models/bookings.js";
import mongoose from "mongoose";

export const getStats = async (req, res) => {
  try {
    const shopId = new mongoose.Types.ObjectId(req.userId);
    const targetDate = new Date();

    const startOfCurrentMonth = startOfMonth(targetDate);
    const endOfCurrentMonth = endOfMonth(targetDate);
    const startOfLastMonth = startOfMonth(subMonths(targetDate, 1));
    const endOfLastMonth = endOfMonth(subMonths(targetDate, 1));

    const [bookingStats, generalStats, contactCount] = await Promise.all([
      Bookings.aggregate([
        {
          $match: {
            shopId: shopId,
            status: { $ne: "cancelled" },
            createdAt: { $gte: startOfLastMonth, $lte: endOfCurrentMonth },
          },
        },
        {
          $group: {
            _id: null,
            salesThisMonth: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ["$createdAt", startOfCurrentMonth] },
                      { $lte: ["$createdAt", endOfCurrentMonth] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            earningsCurrentMonth: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $gte: ["$createdAt", startOfCurrentMonth] },
                      { $lte: ["$createdAt", endOfCurrentMonth] },
                    ],
                  },
                  "$totalAmount",
                  0,
                ],
              },
            },
          },
        },
      ]),
      Stats.findOne({ shopId }),
      Contacts.countDocuments(),
    ]);

    const statsData = generalStats || {
      listings: 0,
      earnings: 0,
      visitors: 0,
      reviews: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        ...(statsData.toObject?.() || statsData),
        leads: contactCount,
        salesThisMonth: bookingStats[0]?.salesThisMonth || 0,
        earningsCurrentMonth: bookingStats[0]?.earningsCurrentMonth || 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

import cron from "node-cron";
import Bookings from "../models/bookings";
import Property from "../models/propertySchema";

cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredBookings = await Bookings.find({
      checkOutDate: { $lte: today },
      status: { $ne: "checked_out" },
      isDisabled: false,
    });

    if (expiredBookings.length > 0) {
      const propertyIds = expiredBookings.map((b) => b.propertyId);

      await Bookings.updateMany(
        { _id: { $in: expiredBookings.map((b) => b._id) } },
        { $set: { status: "checked_out" } }
      );

      await Property.updateMany(
        { _id: { $in: propertyIds } },
        { $set: { status: "active" } }
      );
    }
  } catch (error) {
    console.error("Cron Job Error:", error);
  }
});

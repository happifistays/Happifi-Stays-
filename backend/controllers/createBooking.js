import razorpayInstance from "../config/razorpay.js";
import Bookings from "../models/bookings.js";
import Guests from "../models/guests.js";
import Payment from "../models/payments.js";
import Property from "../models/propertySchema.js";
import Activity from "../models/activitySchema.js";
import Room from "../models/roomSchema.js";
import Stats from "../models/statsSchema.js";
import User from "../models/userSchema.js";
import crypto from "crypto";

export const createBooking = async (req, res) => {
  try {
    const {
      currency,
      checkInDate,
      checkOutDate,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentMethod,
      guests,
      totalAmount, 
    } = req.body;

    const { propertyId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).send({ message: "User not logged in" });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const overlappingBooking = await Bookings.findOne({
      propertyId,
      status: { $ne: "cancelled" },
      checkInDate: { $lt: checkOut },
      checkOutDate: { $gt: checkIn },
    });

    if (overlappingBooking) {
      return res.status(400).send({
        success: false,
        message: "Property already booked for these dates",
      });
    }

    if (paymentMethod === "online") {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).send({ message: "Invalid signature" });
      }
    }

    const property = await Property.findById(propertyId);
    if (!property)
      return res.status(404).send({ message: "Property not found" });

    const paymentData = {
      razorpay_payment_id: razorpay_payment_id || "offline",
      razorpay_order_id: razorpay_order_id || "offline",
      amount: totalAmount,
      method: paymentMethod,
    };
    const paymentDetails = await Payment.create(paymentData);

    const bookingData = {
      shopId: property.owner,
      propertyId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount,
      paymentStatus: paymentMethod === "online" ? "paid" : "pay_at_hotel",
      status: "booked",
      paymentId: paymentDetails._id,
      bookedUserId: userId,
    };

    const createdBooking = await Bookings.create(bookingData);

    await Stats.findOneAndUpdate(
      { shopId: property.owner },
      { $inc: { earnings: totalAmount, visitors: 1 } },
      { upsert: true }
    );

    if (guests?.length > 0) {
      for (const guest of guests) {
        await Guests.create({
          propertyId,
          title: guest.title,
          firstName: guest.firstName,
          lastName: guest.lastName,
          email: req.body.email,
          phone: req.body.phone,
          bookingId: createdBooking._id,
        });
      }
    }

    const bookedUserDetails = await User.findById(userId).select("-password");

    res.status(200).send({
      success: true,
      booking: createdBooking,
      bookedUser: bookedUserDetails,
    });
  } catch (error) {
    return res.status(500).send({ success: false, message: error.message });
  }
};

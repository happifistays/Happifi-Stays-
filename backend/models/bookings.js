import mongoose from "mongoose";

// Counter model to track the sequence
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 999 },
});

const Counter = mongoose.model("Counter", counterSchema);

const bookingsSchema = new mongoose.Schema(
  {
    bookingId: {
      type: Number,
      unique: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded", "pay_at_hotel"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["booked", "checked_in", "checked_out", "cancelled"],
      default: "booked",
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["online", "pay_at_hotel"],
      default: "online",
    },
    trafficSource: {
      type: String,
      enum: ["organic", "google", "social_media", "referral"],
      default: "organic",
    },
    bookedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDisabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Corrected Pre-save hook: Removed 'next' parameter
bookingsSchema.pre("save", async function () {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "bookingId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.bookingId = counter.seq;
  }
});

const Bookings = mongoose.model("Bookings", bookingsSchema);
export default Bookings;

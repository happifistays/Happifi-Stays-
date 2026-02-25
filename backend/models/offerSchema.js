import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDisabled: { type: Boolean, default: false },
    appliedProperties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    ],
  },
  {
    timestamps: true,
  }
);

const Offers = mongoose.model("Offers", offerSchema);

export default Offers;

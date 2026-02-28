import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    listingType: { type: String },
    listingName: { type: String, trim: true },
    listingUse: {
      type: String,
      enum: ["Entire Place", "For Guests", "For Personal"],
      default: "Entire Place",
    },
    shortDescription: { type: String },

    location: {
      district: { type: String },
      state: { type: String },
      city: { type: String },
      street: { type: String },
      postalCode: { type: String },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number] },
      },
    },

    amenities: [{ type: String }],
    description: { type: String },

    thumbnail: { type: String },
    gallery: [{ type: String }],

    policy: {
      description: { type: String },
      cancellationOption: { type: String },
      extraCharges: { type: Number, default: 0 },
    },

    currency: { type: String, default: "USD" },
    basePrice: { type: Number },
    discount: { type: Number, default: 0 },
    starRating: { type: Number, min: 1, max: 5 },

    totalFloors: { type: Number },
    totalRooms: { type: Number },
    propertyArea: { type: Number },

    status: {
      type: String,
      enum: ["active", "draft", "hidden"],
      default: "active",
    },
    availableOffers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offers",
      },
    ],
    isDisabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PropertySchema.index({ "location.coordinates": "2dsphere" });

const Property = mongoose.model("Property", PropertySchema);

export default Property;

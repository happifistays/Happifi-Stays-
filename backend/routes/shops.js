import express from "express";
import { createProperty } from "../controllers/shops/createProperty.js";

import { getProperties } from "../controllers/shops/getProperties.js";
import { updateProperty } from "../controllers/shops/updateProperty.js";
import { deleteRoomById } from "../controllers/shops/deleteProperty.js";
import { getAllBookings } from "../controllers/shops/getAllBookings.js";
import { getStats } from "../controllers/shops/getStats.js";
import { getPropertyById } from "../controllers/common/getPropertyById.js";
import { getListingsCount } from "../controllers/shops/getListingsCount.js";
import { getGraphStats } from "../controllers/shops/getGraphStats.js";
import { getReviews } from "../controllers/shops/getReviews.js";
import { getInvoiceHistory } from "../controllers/shops/getInvoiceHistory.js";
import { getEarningStats } from "../controllers/shops/getEarningStats.js";

import { updateProfile } from "../controllers/shops/updateProfile.js";
import { userVerification } from "../middleware/AuthMiddleware.js";
import { updateRoomById } from "../controllers/shops/updateRoomById.js";
import { deleteReviewById } from "../controllers/shops/deleteReviewById.js";
import { replyToReview } from "../controllers/shops/replyToReview.js";
import {
  deleteActivity,
  deleteAllActivities,
  getUserActivities,
} from "../controllers/shops/activityController.js";
import { getTrafficStats } from "../controllers/trafficController.js";
import { getAllUsers } from "../controllers/shops/getAllUsers.js";
import { deletePropertyById } from "../controllers/shops/deletePropertyById.js";
import { updatePropertyById } from "../controllers/shops/updatePropertyById.js";
import { addOffer } from "../controllers/shops/addOffer.js";
import { getOffers } from "../controllers/shops/getOffers.js";
import { editOffer } from "../controllers/shops/editOffer.js";
import { getOfferById } from "../controllers/shops/getOfferById.js";
import { deleteOffer } from "../controllers/shops/deleteOffer.js";
import { disableReview } from "../controllers/shops/disableReview.js";
import { sendWhatsAppMessage } from "../utils/sendWhatsAppMessage.js";

const shopsRouter = express.Router();

shopsRouter.get("/", (req, res) => {
  res.json({ message: "shopsRouter route" });
});

shopsRouter.post("/property", userVerification, createProperty);
shopsRouter.get("/property/:propertyId", getPropertyById);
shopsRouter.get("/rooms", userVerification, getProperties);
shopsRouter.patch("/property/:propertyId", userVerification, updateProperty);
shopsRouter.delete("/rooms/:roomId", userVerification, deleteRoomById);
shopsRouter.delete(
  "/property/:propertyId",
  userVerification,
  deletePropertyById
);
shopsRouter.get("/bookings", userVerification, getAllBookings);
shopsRouter.get("/stats", userVerification, getStats);
shopsRouter.post("/listing", userVerification);
shopsRouter.get("/listings/count", userVerification, getListingsCount);
shopsRouter.get("/stats/graph", userVerification, getGraphStats);
shopsRouter.get("/reviews", userVerification, getReviews);
shopsRouter.get("/invoices", userVerification, getInvoiceHistory);
shopsRouter.get("/earning-statuses", userVerification, getEarningStats);
shopsRouter.get("/activity", userVerification, getUserActivities);
shopsRouter.delete("/activity/:activityId", userVerification, deleteActivity);
shopsRouter.delete("/activity", userVerification, deleteAllActivities);
shopsRouter.patch("/profile", userVerification, updateProfile);
shopsRouter.patch("/room/:roomId", userVerification, updateRoomById);
shopsRouter.delete("/reviews/:id", userVerification, deleteReviewById);
shopsRouter.patch("/reviews/:id/reply", userVerification, replyToReview);
shopsRouter.get("/traffic/:shopId", getTrafficStats);
shopsRouter.get("/users", userVerification, getAllUsers);

shopsRouter.post("/offer", userVerification, addOffer);
shopsRouter.get("/offers", userVerification, getOffers);
shopsRouter.patch("/offer/:id", userVerification, editOffer);
shopsRouter.get("/offer/:id", getOfferById);
shopsRouter.patch(
  "/property/:propertyId",
  userVerification,
  updatePropertyById
);

shopsRouter.delete("/offer/:id", deleteOffer);
shopsRouter.patch(
  "/reviews/:reviewId/disable",
  userVerification,
  disableReview
);

shopsRouter.get("/test", async (req, res) => {
  await sendWhatsAppMessage("9526374812", "test");
  res.send("dsdsds");
});

export default shopsRouter;

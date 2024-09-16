const express = require("express");

const {
  createReview,
  getReviews,
  getReview,
  EditReview,
  DeleteReview,
  createFilterObj,
  SetProductIdAndUserIDToBody,
} = require("../Controller/ReviewController");
const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../Validators/ReviewValidator");

const router = express.Router({ mergeParams: true });

// =============================
router.get("/AllReviews",createFilterObj, getReviews);
router.get("/Specific-Review/:id", getReview);

router.use(ProtectAuth);
router.post(
  "/createReview",
  isAllowedTo("user"),
  SetProductIdAndUserIDToBody,
  createReviewValidator,
  createReview
);
router.put(
  "/Edit-Review/:id",isAllowedTo("user"),
  updateReviewValidator,
  EditReview
);
router.delete(
  "/Delete-Review/:id",
  isAllowedTo("user", "admin", "manager"),
  updateReviewValidator,
  DeleteReview
);

module.exports = router;

/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const ReviewModel = require("../Models/ReviewModel");
const Factory = require("./FactoryHandlers");



exports.SetProductIdAndUserIDToBody = (req, res, next) => {
  //console.log(req.params.ProductID);
  if (!req.body.ProductID) {
    req.body.ProductID = req.params.ProductID;
  }
  if (!req.body.UserID) {
    req.body.UserID = req.user._id;
  }
  
  next();
};
exports.createFilterObj = (req, res, next) => {
  //console.log(req.params.ProductID);
  let filteredSubCategories = {};
  if (req.params.ProductID)
    filteredSubCategories = { ProductID: req.params.ProductID };
  req.filterObj = filteredSubCategories;
  next();   
};
// @desc    post list of Reviews
// @route   post /api/v1/Reviews
// @access  Public
exports.createReview = Factory.CreateOne(ReviewModel);

// @desc    Get list of Reviews
// @route   GET /api/v1/Reviews
// @access  Public
exports.getReviews = Factory.GetAll(ReviewModel);
// =========================================================================
// @desc    Get unique Reviews
// @route   GET /api/v1/Reviews/Specific-Review/:id
// @access  Public
exports.getReview = Factory.GetOne(ReviewModel, "Review");

// ==========================================================================
// @desc    Update unique Review
// @route   GET /api/v1/Reviews/Edit-Review/:id
// @access  private
exports.EditReview = Factory.UpdateOne(ReviewModel, "Review");
// ==========================================================================
// @desc    Delete unique Review
// @route   Delete /api/v1/Reviews/Delete-Review/:id
// @access  private
exports.DeleteReview = Factory.deleteOne(ReviewModel, "Review");

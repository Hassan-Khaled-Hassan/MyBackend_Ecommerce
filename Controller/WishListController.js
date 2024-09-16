/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const UserModel = require("../Models/UserModel");
const APIError = require("../Utils/apiError");




// ==========================================================================
// @desc    Update unique Users
// @route   GET /api/v1/Users/Edit-User/:id
// @access  private
exports.AddProductToWishList = asyncHandler(async (req, res, next) => {
  const Document = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(
      new APIError(`No User found for this id :  ${req.user._id}`, 404)
    );
  }
  res
    .status(200)
    .json({ status : "Success",message: `Product added Successfully to wishlist`, data: Document });
});

exports.RemoveProductFromWishList = asyncHandler(async (req, res, next) => {
  const Document = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(
      new APIError(`No User found for this id :  ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "Success",
    message: `Product removed Successfully to wishlist`,
    data: Document,
  });
});

exports.GetUserWishList = asyncHandler(async (req, res, next) => {
  const Document = await UserModel.findById(req.user._id).populate("wishlist");
  if (!Document) {
    return next(
      new APIError(`No User found for this id :  ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "Success",
    Results: Document.wishlist.length,
    data: Document.wishlist,
  });
});

/* eslint-disable import/no-extraneous-dependencies */
const CouponModel = require("../Models/CouponModel");
const Factory = require("./FactoryHandlers");



// @desc    post list of Coupons
// @route   post /api/v1/Coupons
// @access  Public
exports.createCoupons = Factory.CreateOne(CouponModel);

// @desc    Get list of Brands
// @route   GET /api/v1/Brands
// @access  Public
exports.getCoupons = Factory.GetAll(CouponModel);
// =========================================================================
// @desc    Get unique Brand
// @route   GET /api/v1/Brands/Specific-Brand/:id
// @access  Public
exports.getCoupon = Factory.GetOne(CouponModel, "Coupon");

// ==========================================================================
// @desc    Update unique Brand
// @route   GET /api/v1/Brands/Edit-Brand/:id
// @access  private
exports.EditCoupon = Factory.UpdateOne(CouponModel, "Coupon");
// ==========================================================================
// @desc    Delete unique category
// @route   Delete /api/v1/Brands/Delete-Brand/:id
// @access  private
exports.DeleteCoupon = Factory.deleteOne(CouponModel, "Coupon");

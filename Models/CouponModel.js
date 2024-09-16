/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1- Create Schema
const CouponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      trim: true, // بتلغي ال spaces
    },
    // A and B => shoping.com/a-and-b
    expire: {
      type: Date,
      required: [true, "Coupon expire is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount value is required"],
    },
  },
  { timestamps: true }
);

// 2- Create model
const CouponModel = mongoose.model("Coupons", CouponSchema);

module.exports = CouponModel;

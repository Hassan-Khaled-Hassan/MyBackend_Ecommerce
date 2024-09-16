/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");

// 1- Create Schema
const CartSchema = new mongoose.Schema(
  {
    CartItems: [
      {
        ProductID: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        Quantity: {
          type: Number,
          default: 1,
        },
        Color: String,
        Price: Number,
      },
    ],
    TotalCartPrice: Number,
    TotalPriceWithDisc: Number,
    UserID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 2- Create model
const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;

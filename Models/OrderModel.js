/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");

// 1- Create Schema
const OrderSchema = new mongoose.Schema(
  {
    UserID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must be belong to User"],
    },
    CartItems: [
      {
        ProductID: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        Quantity: Number,
        Color: String,
        Price: Number,
      },
    ],
    TaxPrice: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    TotalOrderPrice: {
      type: Number,
    },
    PaymentMethod: {
      type: String,
      enum: ["card", "cash"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    PaidAt: Date,
    isDelivered: {
      type: Boolean,
      default: false,
    },
    DeliveredAt: Date,
    shippingAddress: {
      details: String,
      phone: String,
      city: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

OrderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "UserID",
    select: "name profileImage email phone",
  }).populate({
    path: "CartItems.ProductID",
    select: "title imageCover",
  });

  next();
});
// 2- Create model
const CartModel = mongoose.model("Orders", OrderSchema);

module.exports = CartModel;

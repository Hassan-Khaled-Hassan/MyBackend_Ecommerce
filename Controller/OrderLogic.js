/* eslint-disable prefer-template */
/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const OrderModel = require("../Models/OrderModel");
const Factory = require("./FactoryHandlers");
const APIError = require("../Utils/apiError");
const CartModel = require("../Models/CartModel");
const ProductModel = require("../Models/ProductModel");

let cartData = {}; // Global variable to store cart data

exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depend on cartId
  const Cart = await CartModel.findById(req.params.cartId);
  if (!Cart) {
    return next(
      new APIError(`There is no such cart with id: ${req.params.cartId}`, 404)
    );
  }
  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = Cart.TotalPriceWithDisc
    ? Cart.TotalPriceWithDisc
    : Cart.TotalCartPrice;
  const TotalOrderPrice = cartPrice + taxPrice + shippingPrice;
  // 3) Create order with default paymentMethodType cash
  const Order = await OrderModel.create({
    UserID: req.user._id,
    CartItems: Cart.CartItems,
    shippingAddress: req.body.shippingAddress,
    TotalOrderPrice,
  });
  // 4) After creating order, decrement product quantity, increment product sold
  if (Order) {
    const bulkOption = Cart.CartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.ProductID },
        update: { $inc: { quantity: -item.Quantity, soldNum: +item.Quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOption, {}); // bulkWrite : allow us to make more than one action to mongo db

    // 5) Clear cart depend on cartId
    await CartModel.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ status: "success", data: Order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findAllOrders = Factory.GetAll(OrderModel);

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findSpecificOrder = Factory.GetOne(OrderModel,"Order");


// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(
      new APIError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isPaid = true;
  order.PaidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({ status: 'success', data: updatedOrder });
});

// @desc    Update order delivered status
// @route   PUT /api/v1/orders/:id/deliver
// @access  Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(
      new APIError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isDelivered = true;
  order.DeliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: 'success', data: updatedOrder });
});
// ==================================================
// ==================================================
exports.createVisaOrder = asyncHandler(async (req, res,next) => {
  // app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  // 1) Get cart depend on cartId
  // ================
  const {cartId} = req.params;
  cartData[cartId] = cartId;
  // =================
  const Cart = await CartModel.findById(req.params.cartId);
  if (!Cart) {
    return next(
      new APIError(`There is no such cart with id: ${req.params.cartId}`, 404)
    );
  }

  // 2) Get order price depend on cart price "Check if coupon apply"
  const cartPrice = Cart.TotalPriceWithDisc
    ? Cart.TotalPriceWithDisc
    : Cart.TotalCartPrice;
  const TotalOrderPrice = cartPrice + taxPrice + shippingPrice;
  try {
    // Step 1: Get Authentication Token
    const authResponse = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      {
        api_key: process.env.API_KEY,
      }
    );

    const { token, profile } = authResponse.data;
    console.log("token :  ", token);
    console.log("CURRENCY :  ", process.env.CURRENCY);

    console.log(Cart.CartItems);
    // ================================
    // Ensure the items are in the correct format
    const formattedItems = Cart.CartItems.map((item) => ({
      name: item.ProductID, // or whatever the correct field for product name is in your Cart model
      amount_cents: item.Price * 100, // Ensure price is in cents
      description: item.description || "No description", // Provide a default if there's no description
      quantity: item.Quantity, // Ensure quantity is included
    }));
    //=====================================
    // Step 2: Create Order
    const orderResponse = await axios.post(
      "https://accept.paymobsolutions.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: "false",
        amount_cents: TotalOrderPrice * 100,
        currency: process.env.CURRENCY,
        items: formattedItems,
      }
    );
    const orderId = orderResponse.data.id;
    console.log("order  :  " + orderId);
    // ===========================================
    const paymentKeyResponse = await axios.post(
      "https://accept.paymobsolutions.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: TotalOrderPrice * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "12",
          email: req.user.email,
          floor: 1,
          first_name: "Customer",
          street: "123 ,Main Street",
          building: "Building 1",
          phone_number: "+201117525451",
          shipping_method: "NA",
          postal_code: "123",
          city: "Cairo",
          country: "EG",
          last_name: "saad",
          state: "planId",
        },
        currency: process.env.CURRENCY,
        integration_id: process.env.INTEGRATION_ID,
      },
    );
    const paymentKey = paymentKeyResponse.data.token;
    // ===========================================

    res.status(200).json({
      status: "success",
      orderResponse: paymentKeyResponse.data,
      iframe_url: `https://accept.paymobsolutions.com/api/acceptance/iframes/${process.env.IFRAME_ID}?payment_token=${paymentKey}`,
    });
  } catch (error) {
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error("Server Error:", error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network Error:", error.request);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
  }
})


// ====================================
// ======================================
exports.WebBack = asyncHandler(async (req, res,next) => {
  const paymentStatus = req.query.success;

  if (!paymentStatus || paymentStatus === "false") {
    return res
      .status(400)
      .json({ value: "Declined" });
  }
   // eslint-disable-next-line no-use-before-define
   const cartId = cartData[cartId];
    const Cart = await CartModel.findById(cartId);
    if (!Cart) {
      return next(
        new APIError(`There is no such cart with id: ${req.CartID}`, 404)
      );
    }


  res.status(200).json({
    status: "success",
    data: req.body,
    new: req.query.success,
    main: req.CartID,
    main2: paymentStatus,
    main3: Cart,
  });
})
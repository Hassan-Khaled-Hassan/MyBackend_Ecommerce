const asyncHandler = require("express-async-handler");
const CartModel = require("../Models/CartModel");
const ProductModel = require("../Models/ProductModel");
const CouponModel = require("../Models/CouponModel");
const APIError = require("../Utils/apiError");

const CalcTotalPrice = (Cart) => {
  let TotalPrice = 0;
  Cart.CartItems.forEach((item) => {
    TotalPrice += item.Price * item.Quantity;
  });
  Cart.TotalCartPrice = Number(TotalPrice.toFixed(2));
  Cart.totalPriceAfterDiscount = undefined;
  return Number(TotalPrice.toFixed(2));
};

exports.AddProductToCart = asyncHandler(async (req, res, next) => {
    const { ProductID, Color } = req.body;
    const oneProduct = await ProductModel.findById(ProductID);
    console.log(oneProduct);
    // Get Cart for logged user
    let Cart = await CartModel.findOne({ UserID : req.user._id});

    if(!Cart)
    {
        // create cart for logged user with product
        Cart = await CartModel.create({
          UserID: req.user._id,
          CartItems: [
            {
              ProductID,
              Color,
              Price: oneProduct.priceWithDiscount
                ? oneProduct.priceWithDiscount
                : oneProduct.price,
            },
          ],
        });
    }else{
      // 2) check if product exists for user cart
      const productIndex = Cart.CartItems.findIndex(
        (item) =>
          item.ProductID.toString() === ProductID && item.Color === Color
      );
      if (productIndex > -1) {
        //product exists in the cart, update the quantity
        const productItem = Cart.CartItems[productIndex];
        productItem.Quantity += 1;
        Cart.CartItems[productIndex] = productItem;
      } else {
        //product does not exists in cart, add new item
        Cart.CartItems.push({
          ProductID,
          Color,
          Price: oneProduct.price,
        });
      }

    }
    CalcTotalPrice(Cart);
    await Cart.save();
      return res.status(200).json({
        status: "success",
        message: "Product added successfully to your cart",
        numOfCartItems: Cart.CartItems.length,
        data: Cart,
      });
})

exports.GetUserCart = asyncHandler(async (req, res, next) => {
   const Cart = await CartModel.findOne({ UserID: req.user._id })
     .populate({
       path: "CartItems.ProductID",
       select:
         "title description imageCover images ratingAverage ratingQuantity brandID categoryID",
       populate: { path: "brandID", select: "name -_id", model: "Brand" },
     })
     .populate({
       path: "CartItems.ProductID",
       select:
         "title description imageCover images ratingAverage ratingQuantity brandID categoryID",
       populate: { path: "categoryID", select: "name -_id", model: "Category" },
     });
   if(!Cart){
    return next(
      new APIError(`No cart exist for this user: ${req.user._id}`, 404)
    );
   }
   return res.status(200).json({
     status: "success",
     numOfCartItems: Cart.CartItems.length,
     data: Cart,
   });
})



exports.removeCartProduct = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await CartModel.findOneAndUpdate(
    { UserID: req.user._id },
    {
      $pull: { CartItems: { _id: itemId } },
    },
    { new: true }
  )
    .populate({
      path: "CartItems.ProductID",
      select:
        "title description imageCover images ratingAverage ratingQuantity brandID categoryID",
      populate: { path: "brandID", select: "name -_id", model: "Brand" },
    })
    .populate({
      path: "CartItems.ProductID",
      select:
        "title description imageCover images ratingAverage ratingQuantity brandID categoryID",
      populate: { path: "categoryID", select: "name -_id", model: "Category" },
    });

  // Calculate total cart price
  await CalcTotalPrice(cart);

  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.CartItems.length,
    data: cart,
  });
});

exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete({ UserID: req.user._id });

  res.status(200).json({
    status: "success",
  });
});


exports.updateCartProductCount = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { count } = req.body;
  // 1) Check if there is cart for logged user
  const cart = await CartModel.findOne({ UserID: req.user._id })
    .populate({
      path: "CartItems.ProductID",
      select:
        "title description imageCover images ratingAverage ratingQuantity brandID categoryID",
      populate: { path: "brandID", select: "name -_id", model: "Brand" },
    })
    .populate({
      path: "CartItems.ProductID",
      select:
        "title description imageCover images ratingAverage ratingQuantity brandID categoryID",
      populate: { path: "categoryID", select: "name -_id", model: "Category" },
    });
  if (!cart) {
    return next(
      new APIError(`No cart exist for this user: ${req.user._id}`, 404)
    );
  }

  const itemIndex = cart.CartItems.findIndex(
    (item) => item._id.toString() === itemId
  );

  if (itemIndex > -1) {
    //product exists in the cart, update the quantity
    const productItem = cart.CartItems[itemIndex];
    productItem.Quantity = count;
    cart.CartItems[itemIndex] = productItem;
  } else {
    return next(
      new APIError(`No Product Cart item found for this id: ${itemId}`),404
    );
  }
  // Calculate total cart price
  await CalcTotalPrice(cart);
  await cart.save();
  return res.status(200).json({
    status: "success",
    numOfCartItems: cart.CartItems.length,
    data: cart,
  });
});



// @desc      Apply coupon logged user cart
// @route     PUT /api/v1/cart/applyCoupon
// @access    Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  console.log(coupon);
  if (!coupon) {
    return next(new APIError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await CartModel.findOne({ UserID: req.user._id });

  const totalPrice = cart.TotalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2); // 99.23

  cart.TotalPriceWithDisc = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.CartItems.length,
    data: cart,
  });
});
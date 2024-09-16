const express = require("express");
const {
  AddProductToCart,
  GetUserCart,
  removeCartProduct,
  clearLoggedUserCart,
  updateCartProductCount,
  applyCoupon,
} = require("../Controller/CartLogic");
const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");

const router = express.Router();

// =============================
router.use(ProtectAuth, isAllowedTo("admin", "manager"));
router.post("/createCart", AddProductToCart);
 router.get("/MyCart", GetUserCart);
 router.post("/addCoupon", applyCoupon);
 router.put("/Edit-Item/:itemId", updateCartProductCount);
 router.delete("/Delete-Item/:itemId", removeCartProduct);
 router.delete("/DeleteAll", clearLoggedUserCart);


module.exports = router;

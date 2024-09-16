const express = require("express");

const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");
const {
  AddProductToWishList,
  RemoveProductFromWishList,
  GetUserWishList,
} = require("../Controller/WishListController");

const router = express.Router();

router.use(ProtectAuth, isAllowedTo("user"));

router.post("/addToWishlist", AddProductToWishList);
router.delete("/removeFromWishlist/:productId", RemoveProductFromWishList);
router.get("/MyWishlist", GetUserWishList);

module.exports = router;
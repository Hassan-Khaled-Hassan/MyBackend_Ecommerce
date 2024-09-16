const express = require("express");
const {
  createCoupons,
  getCoupons,
  getCoupon,
  EditCoupon,
  DeleteCoupon,
} = require("../Controller/CouponsLogic");
const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");

const router = express.Router();

// =============================
router.use(ProtectAuth, isAllowedTo("admin", "manager"));
router.post(
  "/createCoupon",
  createCoupons
);
router.get("/AllCoupons", getCoupons);
router.get("/Specific-Coupon/:id", getCoupon);
router.put(
  "/Edit-Coupon/:id",
  EditCoupon
);
router.delete(
  "/Delete-Coupon/:id",
  DeleteCoupon
);

module.exports = router;

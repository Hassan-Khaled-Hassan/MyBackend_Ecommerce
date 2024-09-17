const express = require("express");
const {
  createCashOrder,
  findAllOrders,
  filterOrderForLoggedUser,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  createVisaOrder,
  WebBack,
} = require("../Controller/OrderLogic");
const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");

const router = express.Router();
// =============================
router.get("/webBack", WebBack);

router.use(ProtectAuth);
router.post("/createVisaOrder/:cartId", createVisaOrder);
router.post(
  "/createOrder/:cartId",
  isAllowedTo("admin", "manager"),
  createCashOrder
);
router.get(
  "/allOrders",
  isAllowedTo("user", "admin", "manager"),   // must be user only
  filterOrderForLoggedUser,
  findAllOrders
);
router.get("/order/:id", findSpecificOrder);
router.get(
  "/update/:id/pay",
  isAllowedTo( "admin", "manager"),
  updateOrderToPaid
);
router.get(
  "/update/:id/deliver",
  isAllowedTo("admin", "manager"),
  updateOrderToDelivered
);


module.exports = router;

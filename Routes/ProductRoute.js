//ProductRoute
const express = require("express");
const {
  createProduct,
  getProducts,
  getProduct,
  EditProduct,
  DeleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../Controller/ProductLogic");
const {
  createProductValidator,
  getProductValidator,
  deleteProductValidator,
  updateProductValidator,
} = require("../Validators/ProductValidator");

const ReviewRoute = require("./ReviewRoute");

const router = express.Router();

console.log("my api test")
router.use("/:ProductID/reviews", ReviewRoute);
// =============================
//Router.route("/").get(CategoryLogic).post(CreateCategories);
// =============================
router.get("/AllProducts", getProducts);

 const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");

router.post(
  "/createProduct",
  ProtectAuth,
  isAllowedTo("admin", "manager"),
  uploadProductImages,
  resizeProductImages,
  createProductValidator,
  createProduct
);
router.get("/Specific-Product/:id", getProductValidator, getProduct);
router.put(
  "/Edit-Product/:id",
  ProtectAuth,
  isAllowedTo("admin", "manager"),
  uploadProductImages,
  resizeProductImages,
  updateProductValidator,
  EditProduct
);
router.delete(
  "/Delete-Product/:id",
  ProtectAuth,
  isAllowedTo("admin"),
  deleteProductValidator,
  DeleteProduct
);

module.exports = router;



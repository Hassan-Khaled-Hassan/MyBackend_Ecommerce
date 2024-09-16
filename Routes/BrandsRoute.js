const express = require("express");
const SubCategoryRoute = require("./SubCategoryRoute");
const {
  createBrands,
  getBrands,
  getBrand,
  EditBrand,
  DeleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../Controller/BrandLogic");
const { createBrandValidator, getBrandValidator, updateBrandValidator, deleteBrandValidator } = require("../Validators/BrandValidator");
const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");

const router = express.Router();

router.use("/:categoryID/subCategories", SubCategoryRoute);
// =============================
router.post(
  "/createBrand",
  ProtectAuth,
  isAllowedTo("admin", "manager"),
  uploadBrandImage,
  resizeImage,
  createBrandValidator,
  createBrands
);
router.get("/AllBrands", getBrands);
router.get("/Specific-Brand/:id", getBrandValidator, getBrand);
router.put(
  "/Edit-Brand/:id",
  ProtectAuth,
  isAllowedTo("admin", "manager"),
  uploadBrandImage,
  resizeImage,
  updateBrandValidator,
  EditBrand
);
router.delete(
  "/Delete-Brand/:id",
  ProtectAuth,
  isAllowedTo("admin"),
  deleteBrandValidator,
  DeleteBrand
);

module.exports = router;

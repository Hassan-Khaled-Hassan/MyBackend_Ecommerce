const express = require("express");
const SubCategoryRoute = require("./SubCategoryRoute");
const {
  createCategory,
  getCategories,
  getCategory,
  EditCategory,
  DeleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../Controller/CategoryLogic");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../Validators/CategoryValidator");
const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");

const router = express.Router();

router.use("/:categoryID/subCategories", SubCategoryRoute);
// =============================
//Router.route("/").get(CategoryLogic).post(CreateCategories);
// =============================
router.post(
  "/createCategory",
  ProtectAuth,
  isAllowedTo("admin","manager"),
  uploadCategoryImage,
  resizeImage,
  createCategoryValidator,
  createCategory
);
router.get("/AllCategories", getCategories);
router.get("/Specific-Category/:id", getCategoryValidator, getCategory);
router.put(
  "/Edit-Category/:id",
  ProtectAuth,
  isAllowedTo("admin", "manager"),
  uploadCategoryImage,
  resizeImage,
  updateCategoryValidator,
  EditCategory
);
router.delete(
  "/Delete-Category/:id",
  ProtectAuth,
  isAllowedTo("admin"),
  deleteCategoryValidator,
  DeleteCategory
);

module.exports = router;

const express = require("express");
const {
  createSubCategory,
  getSubCategories,
  getSubCategory,
  EditSubCategory,
  DeleteSubCategory,
  SetCategoryIdToBody,
  createFilterObj,
} = require("../Controller/SubCategoryLogic");
const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../Validators/SubCategoryValidator");
const { ProtectAuth, isAllowedTo } = require("../Controller/AuthLogic");

// mergeParams : allow us to access parameters on other routers
const router = express.Router({mergeParams:true});
// =============================

router.post(
  "/addSubCategory",
  ProtectAuth,
  isAllowedTo("admin", "manager"),
  SetCategoryIdToBody,
  createSubCategoryValidator,
  createSubCategory
);

router.get("/AllSubCategories",createFilterObj, getSubCategories);
router.get(
  "/Specific-SubCategory/:id",
  getSubCategoryValidator,
  getSubCategory
);
router.put(
  "/Edit-SubCategory/:id",
  ProtectAuth,
  isAllowedTo("admin", "manager"),
  updateSubCategoryValidator,
  EditSubCategory
);
router.delete(
  "/Delete-SubCategory/:id",
  ProtectAuth,
  isAllowedTo("admin"),
  deleteSubCategoryValidator,
  DeleteSubCategory
);

module.exports = router;

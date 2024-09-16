const SubCategoryModel = require("../Models/SubCategoryModel");
const Factory = require("./FactoryHandlers");

exports.SetCategoryIdToBody = (req, res,next) => {
    if (!req.body.category) {
      req.body.category = req.params.categoryID;
    }
  next()
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filteredSubCategories = {};
  if (req.params.categoryID)
    filteredSubCategories = { category: req.params.categoryID };
  req.filterObj = filteredSubCategories;
  next();
};
// @desc    Get unique category
// @route   GET /api/v1/categories/addSubCategory
// @access  Public
exports.createSubCategory = Factory.CreateOne(SubCategoryModel);
// =========================================================================
// @desc    Get list of sub  categories on specified category
// @route  /api/v1/categories/:category-id/subCategories/AllSubCategories
// @access  Public
// @desc    Get list of sub  categories
// @route  /api/v1/sub-categories/AllSubCategories
// @access  Public
exports.getSubCategories = Factory.GetAll(SubCategoryModel);
// =========================================================================
// @desc    Get unique category
// @route   GET /api/v1/Subcategories/Specific-SubCategory/:id
// @access  Public
exports.getSubCategory = Factory.GetOne(SubCategoryModel, "SubCategory");
// ==========================================================================
// @desc    Update unique category
// @route   GET /api/v1/categories/Edit-SubCategory/:id
// @access  private
exports.EditSubCategory = Factory.UpdateOne(SubCategoryModel, "SubCategory");
// ==========================================================================
// ==========================================================================
// @desc    Update unique category
// @route   GET /api/v1/categories/delete-SubCategory/:id
// @access  private
exports.DeleteSubCategory = Factory.deleteOne(SubCategoryModel, "SubCategory");
// ==========================================================================



/* eslint-disable prefer-const */
/* eslint-disable prefer-template */
/* eslint-disable camelcase */
const { check, validationResult, body } = require("express-validator");
const slugify = require("slugify");
const Validators = require("../middleWares/ValidatorMiddleWare");
const CategoryModel = require("../Models/CategoryModel");
const SubCategoryModel = require("../Models/SubCategoryModel");
// check => دي بتتشك بدل ال  query,param,body
exports.getProductValidator = [
  check("id").isMongoId().withMessage("Product ID is invalid"),
  Validators,
];
exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Too short Product title")
    .isLength({ max: 100 })
    .withMessage("Too long Product title")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Too short Product description")
    .isLength({ max: 2000 })
    .withMessage("Too Long Product description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be number."),
  check("soldNum")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be number."),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be number.")
    .isLength({ max: 32 })
    .withMessage("Too Long Product price"),
  check("priceWithDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceWithDiscount must be number.")
    .toFloat() // convert to float
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceWithDiscount must be lower than Price");
      }
      return true;
    }),
  check("allColors")
    .optional()
    .isArray()
    .withMessage("allColors must be array of strings."),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be array of strings."),
  check("categoryID")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (categoryId) => {
      const existingUser = await CategoryModel.findById(categoryId);
      if (!existingUser) {
        // Will use the below as the error message
        throw new Error(`No category for this id: ${categoryId}`);
      }
    }),
  check("SubCategoryID")
    .optional()
    .isMongoId()
    .withMessage("SubCategory ID is invalid")
    .custom(async (subcategoriesIds) => {
      const existingUser = await SubCategoryModel.find({
        _id: { $exists: true, $in: subcategoriesIds }, // $exists: true, $in: subcategoriesIds : use with mongo db only
      });
      console.log("Length  :   " + existingUser.length);

      if (
        (!existingUser && existingUser.length < 1) ||
        existingUser.length !== subcategoriesIds.length
      ) {
        // Will use the below as the error message
        throw new Error(`Invalid subcategories Ids`);
      }
    })
    .custom(async (val, { req }) => {
      const subcategories = await SubCategoryModel.find({
        category: req.body.categoryID,
      });
      let SubCategoriesInDB = [];
      subcategories.forEach((subCategory) => {
        SubCategoriesInDB.push(subCategory._id.toString());
        // check if subcategories ids in db include subcategories in req.body (true)
      });
      const checker = (target, arr) => target.every((v) => arr.includes(v));
      if (!checker(val, SubCategoriesInDB)) {
        throw new Error(`subcategories not belong to category`);
      }
    }),
  check("brandID").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingAverage")
    .optional()
    .isNumeric()
    .withMessage("Product ratingAverage must be number.")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Product ratingQuantity must be number."),
  Validators,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Product ID is invalid"),
  body("title")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  Validators,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Product ID is invalid"),
  Validators,
];

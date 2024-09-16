const {check, validationResult, body } = require("express-validator");
const slugify = require("slugify");
const Validators = require("../middleWares/ValidatorMiddleWare");
// check => دي بتتشك بدل ال  query,param,body

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Category ID is invalid"),
  Validators,
];
exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  Validators,
];
exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Category ID is invalid"),
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),
  Validators,
];
exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Category ID is invalid"),
  Validators,
];
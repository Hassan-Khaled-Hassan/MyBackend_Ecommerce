/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const CategoryModel = require("../Models/CategoryModel");
const SubCategoryModel = require("../Models/SubCategoryModel");
const Factory = require("./FactoryHandlers");
const { uploadSingleImage } = require("../middleWares/UploadImage");


// upload single image
exports.uploadCategoryImage = uploadSingleImage("image");
// used to make preprocessing using sharp library
exports.resizeImage = asyncHandler(async(req, res,next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if(req.file){
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/${filename}`);
      // save image to body
      req.body.image = filename;
  }


    next();
});
//================================================================

// @desc    Get list of categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = Factory.GetAll(CategoryModel);
// =========================================================================
// @desc    Get unique category
// @route   GET /api/v1/categories/Specific-Category/:id
// @access  Public
exports.getCategory = Factory.GetOne(CategoryModel, "Category");
// ==========================================================================

// exports.createCategory = (req, res) => {
//   const name = req.body.name;
//   console.log(req.body);
//   // -----------------first way -------------
//   //   const newCategory = new CategoryModel({ name });
//   //   newCategory.save().then((ind)=>{
//   //       res.json(ind)
//   //   }).catch((err) =>{
//   //       res.json(err)
//   //   })
//   // -----------------second way -------------
//   CategoryModel.create({ name, slug: slugify(name) })
//     .then((cat) => {
//       res.status(201).json({ data: cat });
//     })
//     .catch((err) => {
//       res.status(400).send(err);
//     });
// };
exports.createCategory = Factory.CreateOne(CategoryModel);

// ==========================================================================
// @desc    Update unique category
// @route   GET /api/v1/categories/Edit-Category/:id
// @access  private
exports.EditCategory = Factory.UpdateOne(CategoryModel, "Category");
// ==========================================================================
// ==========================================================================
// @desc    Update unique category
// @route   GET /api/v1/categories/Edit-Category/:id
// @access  private
exports.DeleteCategory = Factory.deleteOne(
  CategoryModel,
  "Category",
  SubCategoryModel
);
// ==========================================================================

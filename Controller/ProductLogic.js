const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const ProductModel = require("../Models/ProductModel");
const Factory = require("./FactoryHandlers");

const APIError = require("../Utils/apiError");
const { uploadMixOfImages } = require("../middleWares/UploadImage");


exports.uploadProductImages = uploadMixOfImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  console.log(req.files);
  // processing to image cover
  if (req.files.imageCover) {
    const imageCoverFileName = `Product-${uuidv4()}-${Date.now()}-Cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);
    // save image to body
    req.body.imageCover = imageCoverFileName;
  }
  // processing to list of images
  if (req.files.images) {
    req.body.images=[];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `Product-${uuidv4()}-${Date.now()}-image(${index + 1}).jpeg`;
        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        // save image to body
        req.body.images.push(imageName);
      })
    );
    next();
    //console.log(req.body.imageCover);
    //console.log(req.body.images);
  }
});
// ----------------------------------------------
// ==============================================================
// @desc    Get list of Products
// @route   GET /api/v1/Products
// @access  Public
exports.getProducts = Factory.GetAll(ProductModel);
// =========================================================================
// @desc    Get unique Product
// @route   GET /api/v1/Products/Specific-Product/:id
// @access  Public
exports.getProduct = Factory.GetOne(ProductModel, "Product", "reviews");
// =============================GetOne=============================================
// @desc    Create new Product
// @route   POST /api/v1/Products/addProduct
// @access  Public
exports.createProduct = Factory.CreateOne(ProductModel);
// ==========================================================================
// @desc    Update unique category
// @route   GET /api/v1/categories/Edit-Category/:id
// @access  private
exports.EditProduct = Factory.UpdateOne(ProductModel, "Product");
// ==========================================================================
// ==========================================================================
// @desc    Update unique category
// @route   GET /api/v1/categories/Edit-Category/:id
// @access  private
exports.DeleteProduct = Factory.deleteOne(ProductModel, "Product");
// ==========================================================================

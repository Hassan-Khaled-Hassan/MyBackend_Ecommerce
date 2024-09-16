/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const BrandsModel = require("../Models/BrandsModel");
const Factory = require("./FactoryHandlers");
const { uploadSingleImage } = require("../middleWares/UploadImage");

// upload single image
exports.uploadBrandImage = uploadSingleImage("image");
// used to make preprocessing using sharp library
exports.resizeImage = asyncHandler(async(req, res,next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);
    // save image to body
    req.body.image = filename;

    next();
});
//================================================================

// @desc    post list of Brands
// @route   post /api/v1/Brands
// @access  Public
exports.createBrands = Factory.CreateOne(BrandsModel);


// @desc    Get list of Brands
// @route   GET /api/v1/Brands
// @access  Public
exports.getBrands = Factory.GetAll(BrandsModel);
// =========================================================================
// @desc    Get unique Brand
// @route   GET /api/v1/Brands/Specific-Brand/:id
// @access  Public
exports.getBrand = Factory.GetOne(BrandsModel, "Brand");

// ==========================================================================
// @desc    Update unique Brand
// @route   GET /api/v1/Brands/Edit-Brand/:id
// @access  private
exports.EditBrand = Factory.UpdateOne(BrandsModel, "Brand");
// ==========================================================================
// @desc    Delete unique category
// @route   Delete /api/v1/Brands/Delete-Brand/:id
// @access  private
exports.DeleteBrand = Factory.deleteOne(BrandsModel,"Brand");
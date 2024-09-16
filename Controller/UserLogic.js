/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const UserModel = require("../Models/UserModel");
const Factory = require("./FactoryHandlers");
const { uploadSingleImage } = require("../middleWares/UploadImage");
const APIError = require("../Utils/apiError");
const createToken = require("../Utils/createToke");


// upload single image
exports.uploadUserImage = uploadSingleImage("profileImage");
// used to make preprocessing using sharp library
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `User-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file){
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/Users/${filename}`);
    // save image to body
    req.body.profileImage = filename;
  }
  next();
});
//================================================================

// @desc    post list of Users
// @route   post /api/v1/Users/
// @access  Public
exports.createUser = Factory.CreateOne(UserModel);

// @desc    Get list of Users
// @route   GET /api/v1/Users
// @access  Public
exports.getUsers = Factory.GetAll(UserModel);
// =========================================================================
// @desc    Get unique User
// @route   GET /api/v1/Users/Specific-User/:id
// @access  Public
exports.getUser = Factory.GetOne(UserModel, "User");

// ==========================================================================
// @desc    Update unique Users
// @route   GET /api/v1/Users/Edit-User/:id
// @access  private
exports.EditUser = asyncHandler(async (req, res, next) => {
  const Document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(
      new APIError(`No User found for this id :  ${req.params.id}`, 404)
    );
  }
  res
    .status(200)
    .json({ message: `User Updated Successfully`, data: Document });
});
// ==========================================================================
exports.updateUserPass = asyncHandler(async (req, res, next) => {
  const Document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password,12),
      PasswordChangedAt : Date.now()
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(
      new APIError(`No User found for this id :  ${req.params.id}`, 404)
    );
  }
  res
    .status(200)
    .json({ message: `User Updated Successfully`, data: Document });
});
// ==========================================================================
// @desc    Delete unique Users
// @route   Delete /api/v1/Users/Delete-Users/:id
// @access  private
exports.DeleteUser = Factory.deleteOne(UserModel, "User");


// @desc    Get logged user data
// @route   GET /api/v1/Users/Specific-User/:id
// @access  Public
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});


exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const UserData = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      PasswordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = createToken(UserData._id);
  res
    .status(200)
    .json({ message: `User Updated Successfully`, data: UserData, token });
});



exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const UserData = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );
const token = createToken(UserData._id);
  res
    .status(200)
    .json({ message: `User Updated Successfully`, data: UserData, token });
});

// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({ status: 'Success' });
});
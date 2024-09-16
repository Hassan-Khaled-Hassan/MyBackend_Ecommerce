/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const UserModel = require("../Models/UserModel");
const APIError = require("../Utils/apiError");

// ==========================================================================
// @desc    Update unique Users
// @route   GET /api/v1/Users/Edit-User/:id
// @access  private
exports.AddUserAddress = asyncHandler(async (req, res, next) => {
  const Document = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { Addresses: req.body },
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(
      new APIError(`No User found for this id :  ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "Success",
    message: `Address added Successfully......`,
    data: Document,
  });
});

exports.DeleteUserAddress = asyncHandler(async (req, res, next) => {
    const { AddressId } = req.params;
  const Document = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { Addresses: { _id: AddressId } },
    },
    {
      new: true,
    }
  );
  if (!Document) {
    return next(
      new APIError(`No User found for this id :  ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "Success",
    message: `Address removed Successfully......`,
    data: Document,
  });
});

exports.GetUserAddresses = asyncHandler(async (req, res, next) => {
  const Document = await UserModel.findById(req.user._id).populate("Addresses");
  if (!Document) {
    return next(
      new APIError(`No User found for this id :  ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "Success",
    Results: Document.Addresses.length,
    data: Document.Addresses,
  });
});

// @desc      update address from addresses list
// @route     PUT /api/v1/addresses/:addressId
// @access    Private/User
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  address.alias = req.body.alias || address.alias;
  address.details = req.body.details || address.details;
  address.phone = req.body.phone || address.phone;
  address.city = req.body.city || address.city;
  address.postalCode = req.body.postalCode || address.postalCode;

  await user.save();

  return res.status(200).json({
    status: 'success',
    message: 'Address updated successfully',
    data: address,
  });
});

// @desc      Get Specific address from addresses list
// @route     Get /api/v1/addresses/:addressId
// @access    Private/User
exports.getAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  return res.status(200).json({
    status: 'success',
    data: address,
  });
});

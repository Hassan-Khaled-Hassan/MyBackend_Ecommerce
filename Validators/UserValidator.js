/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
const { check, validationResult, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const Validators = require("../middleWares/ValidatorMiddleWare");
const UserModel = require("../Models/UserModel");

// Validators for handling various operations
exports.getUserValidator = [
  check("id").isMongoId().withMessage("Brand ID is invalid"),
  Validators,
];

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) => {
      // Return the promise to handle it correctly
      return UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          // Throwing an error will be caught by express-validator
          return Promise.reject(new Error("Email is already Existed"));
        }
      });
    }),

  check("password")
    .notEmpty()
    .withMessage("User password is required")
    .isLength({ min: 6 })
    .withMessage("Too short User password").custom((value,{req})=>{
        if(value !== req.body.passwordConfirm){
             throw new Error(`password Confirmation incorrect`);
        }
        return true;
    }),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("User passwordConfirm is required"),

  check("profileImage").optional(),
  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted EG and SA"),

  Validators,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("User ID is invalid"),
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value) => {
      // Return the promise to handle it correctly
      return UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          // Throwing an error will be caught by express-validator
          return Promise.reject(new Error("Email is already Existed"));
        }
      });
    }),
    
  check("profileImage").optional(),
  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted EG and SA"),
  Validators,
];
exports.updateUserPasswordValidator = [
  check("id").isMongoId().withMessage("User ID is invalid"),
  check("currentPass").notEmpty().withMessage("SET Current user Password"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("User passwordConfirm is required"),
  check("password")
    .notEmpty()
    .withMessage("SET user password")
    .custom(async (value, { req }) => {
      // verify current pass
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        throw new Error(`User not fount on this id : ${req.params.id}`);
      }
      const isEqual = await bcrypt.compare(req.body.currentPass, user.password);
      if (!isEqual) {
        throw new Error(`Incorrect Current Password`);
      } 
      // verify password equal passwordConfirm
      if (value !== req.body.passwordConfirm) {
        throw new Error(`password Confirmation incorrect`);
      }
      return true;
    }),

  Validators,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("User ID is invalid"),
  Validators,
];


// logged user ------------------------
exports.updateLoggedUserValidator = [
  body("name")
    .optional()
    .custom((value, { req }) => {
      req.body.slug = slugify(value);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("User email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .custom((value , {req}) => {
      console.log(req.user.email);
      if (req.user.email === value) {
        return true;
      }
      // Return the promise to handle it correctly
      return UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          // Throwing an error will be caught by express-validator
          return Promise.reject(new Error("Email is already Existed"));
        }
      });
    }),

  check("profileImage").optional(),
  check("role").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number only accepted EG and SA"),
  Validators,
];
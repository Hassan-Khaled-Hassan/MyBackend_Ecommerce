/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// 1- Create Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true, // بتلغي ال spaces
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [6, "Too short User password"],
    },

    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    phone: String,
    profileImage: String,
    PasswordChangedAt: Date,
    PasswordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    // child ref : wishlist
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    Addresses : [
      {
        id : {type: mongoose.Schema.Types.ObjectId},
        alias : String,
        details : String,
        Phone : String,
        city : String,
        postalCode : String,
      }
    ]
  },
  { timestamps: true }
);

// mongoose middle ware use with create
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password"))  return next();
   this.password = await bcrypt.hash(this.password,12);
   next()
});
// 2- Create model
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;

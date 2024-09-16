const mongoose = require("mongoose");
// 1- Create Schema
const SubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      trim: true, // بتلغي ال spaces
      unique: [true, "Category must be unique"],
      minlength: [2, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    // A and B => shopping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must be belong to main Category"],
    },
    
  },
  { timestamps: true }
);

// 2- Create model
const SubCategoryModel = mongoose.model("SubCategory", SubCategorySchema);

module.exports = SubCategoryModel;

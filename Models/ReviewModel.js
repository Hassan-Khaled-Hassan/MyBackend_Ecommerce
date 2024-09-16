/* eslint-disable prefer-arrow-callback */
const mongoose = require("mongoose");
const ProductModel = require('./ProductModel')
// 1- Create Schema
const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Review required"],
    },
    // A and B => shoping.com/a-and-b
    rating: {
      type: Number,
      min: [1, "Too short Review rating 1.0"],
      max: [5, "Too long Review rating 5.0"],
      required: [true, "Review rating required"],
    },
    ProductID: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must be belong to main Product"],
    },
    UserID: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must be belong to main User"],
    },
  },
  { timestamps: true }
);
ReviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "UserID", select: "name profileImage" });
  next();
});

ReviewSchema.statics.CalcAverageAndQuantity = async function (ProdID) {
  const Results = await this.aggregate([
    // stage 1 to get all reviews on selected ProductID
    { $match: { ProductID: ProdID } },
    //
    {
      $group: {
        _id: "ProductID",
        avgRatings: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  console.log(Results);
  if(Results.length > 0){
    await ProductModel.findByIdAndUpdate(ProdID, {
      ratingAverage: Results[0].avgRatings,
      ratingQuantity: Results[0].ratingsQuantity,
    });
  }else{
    await ProductModel.findByIdAndUpdate(ProdID, {
      ratingAverage: 0,
      ratingQuantity: 0,
    });
  }
};

ReviewSchema.post("save", async function (){
    await this.constructor.CalcAverageAndQuantity(this.ProductID);
})
// to handle it on delete
// After deleting a review
ReviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    doc.constructor.CalcAverageAndQuantity(doc.ProductID);
  }
});
// 2- Create model
const CategoryModel = mongoose.model("Review", ReviewSchema);

module.exports = CategoryModel;

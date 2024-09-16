
const mongoose = require("mongoose");
// 1- Create Schema
const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title required"],
      trim: true, // بتلغي ال spaces
      minlength: [3, "Too short Product title"],
      maxlength: [100, "Too long Product title"],
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short Product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    soldNum: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price required"],
      trim: true,
      max: [200000, "Too long Product price"],
    },
    priceWithDiscount: {
      type: Number,
    },
    allColors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image Cover is required"],
    },
    images: [String],

    categoryID: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to main Category"],
    },
    SubCategoryID: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brandID: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
      // required: [true, "Product must be belong to main Brand"],
    },
    ratingAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1"],
      max: [5, "Rating must be below or equal 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
     // to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual populate to get all reviews on one product
ProductSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "ProductID",
  localField: "_id",
});
// mongoose query middleware to populate category
ProductSchema.pre(/^find/,function(next){
    this.populate({ path: "categoryID", select: "name" });
    next();
})

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const Images = []
    doc.images.forEach((image)=>{
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      Images.push(imageUrl);
    })
    doc.images = Images;
  }
};
// mongoose middle ware use with get, get all and update
ProductSchema.post("init", (doc) => {
  setImageUrl(doc);
});
// mongoose middle ware use with create
ProductSchema.post("save", (doc) => {
  setImageUrl(doc);
});
// 2- Create model
const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;

const mongoose = require("mongoose");
// 1- Create Schema
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: [true, "Brand must be unique"],
      minlength: [3, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};
// mongoose middle ware use with get, get all and update
BrandSchema.post("init", (doc) => {
  setImageUrl(doc);
});
// mongoose middle ware use with create
BrandSchema.post("save", (doc) => {
  setImageUrl(doc);
});
// 2- Create model
const BrandsModel = mongoose.model("Brand", BrandSchema);

module.exports = BrandsModel;

const CategoryRoute = require("./CategoryRoute");
const SubCategoryRoute = require("./SubCategoryRoute");
const BrandRoute = require("./BrandsRoute");
const ProductRoute = require("./ProductRoute");
const UserRoute = require("./UserRoute");
const AuthRoute = require("./AuthRoute");
const ReviewRoute = require("./ReviewRoute");
const WishlistRoute = require("./WishlistRoute");
const AddressRoute = require("./AddressRoute");
const CouponRoute = require("./CouponRoute");
const CartRoute = require("./CartRoute");
const OrderRoute = require("./OrderRoute");

// ================================================================
const mainRoute = (app) => {
  app.use("/api/v1/categories", CategoryRoute);
  app.use("/api/v1/sub-categories", SubCategoryRoute);
  app.use("/api/v1/Brands", BrandRoute);
  app.use("/api/v1/Products", ProductRoute);
  app.use("/api/v1/Users", UserRoute);
  app.use("/api/v1/auth", AuthRoute);
  app.use("/api/v1/reviews", ReviewRoute);
  app.use("/api/v1/wishlists", WishlistRoute);
  app.use("/api/v1/Addresses", AddressRoute);
  app.use("/api/v1/Coupons", CouponRoute);
  app.use("/api/v1/Carts", CartRoute);
  app.use("/api/v1/Orders", OrderRoute);


};

module.exports = mainRoute
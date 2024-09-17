/* eslint-disable import/no-extraneous-dependencies */
const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const DBConnection = require("./DataBaesConfig/DataBase");
const mainRoute = require("./Routes/Index");




const APIError = require("./Utils/apiError");
const globalError = require("./middleWares/errorMiddleWare");

dotenv.config({ path: "config.env" });
// ====================================
DBConnection();

const app = express();
app.get("/", (req, res) => {
  res.send("it is running")
})
app.use(cors());
app.options("*", cors());
// compress all responses
app.use(compression());

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// ===============================================
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}
// =================================================================
mainRoute(app)

app.all("*", (req, res, next) => {
  // const error = new Error(`Cant find this route : ${req.originalUrl}`)
  // next(error.message);
  next(new APIError(`Cant find this route : ${req.originalUrl}`, 400));
});
// global error to handle middle ware for express
app.use(globalError);
// ===============================================
const Port = process.env.PORT || 8000;
const server = app.listen(8000, () => {
  console.log(`app is running on port : ${Port}`);
});

process.on("unhandledRejection", (error) => {
  console.error(`unhandledRejection error : ${error.name} | ${error.message}`);
  server.close(() => {
    console.log("Shutting down.......");
    process.exit(1);
  });
});



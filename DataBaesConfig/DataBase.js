const mongoose = require("mongoose");
const DBConnection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then((con) => {
      console.log(`data base connected : ${con.connection.host}`);
    })
    // .catch((error) => {
    //   console.error(`data base error : ${error}`);
    //   process.exit(1);
    // });
};
module.exports = DBConnection;

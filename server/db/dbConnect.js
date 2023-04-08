// external imports
const mongoose = require("mongoose");
const dotenv =  require("dotenv");

dotenv.config();

async function dbConnect() {
  mongoose
    .connect(
      process.env.MONGO_URL
    )
    .then(() => {
      console.log("Successfully connected to MongoDB Atlas!");
    })
    .catch((error) => {
      console.log("Unable to connect to MongoDB Atlas!");
      console.error(error);
    });
}

module.exports = dbConnect;
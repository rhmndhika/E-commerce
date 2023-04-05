// external imports
const mongoose = require("mongoose");
require('dotenv').config()

async function dbConnect() {
  mongoose
    .connect(
      "mongodb+srv://rahmandhika:0p83RCbX1brFyptZ@ecommerce.vac0m5u.mongodb.net/Ecommerce?retryWrites=true&w=majority"
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
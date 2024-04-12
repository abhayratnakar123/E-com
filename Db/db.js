const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_CONNECTION_URI}`);
    console.log("Db connected")
  } catch (error) {
    console.log("Error connecting Db",error.message);
  }
};

module.exports = connectToDB;

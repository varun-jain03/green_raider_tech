// Dependencies
const mongoose = require('mongoose');


// Connect To MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected:`);
  } catch (error) {
    console.log("DataBase Connection Failed: ", error.message);
  }
};

module.exports = connectDB;

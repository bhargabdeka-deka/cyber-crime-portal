const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/cybercrimeDB");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("Database connection failed");
    process.exit(1);
  }
};

module.exports = connectDB;

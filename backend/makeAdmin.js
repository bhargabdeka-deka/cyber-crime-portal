require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function setAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
    const user = await User.findOneAndUpdate(
      { email: "test@example.com" },
      { role: "admin" },
      { new: true }
    );
    if (user) {
      console.log("Updated test@example.com to ADMIN role");
    } else {
      console.log("User test@example.com not found");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setAdmin();

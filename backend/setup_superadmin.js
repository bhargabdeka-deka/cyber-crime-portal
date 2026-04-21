require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function setupSuperAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Bhargab@349", salt);

    const result = await User.updateOne(
      { email: "bhargab1234deka@gmail.com" },
      { 
        $set: { 
          password: hashedPassword, 
          role: "superadmin", 
          isDisabled: false 
        } 
      },
      { upsert: true }
    );

    console.log("Superadmin setup complete:", result);
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

setupSuperAdmin();

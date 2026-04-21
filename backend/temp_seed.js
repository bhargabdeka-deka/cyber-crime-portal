require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function seedTestUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    // Create Superadmin
    let superadmin = await User.findOne({ email: "super@example.com" });
    if (!superadmin) {
      superadmin = new User({
        name: "Super Admin",
        email: "super@example.com",
        password: hashedPassword,
        role: "superadmin"
      });
      await superadmin.save();
      console.log("Superadmin seeded");
    } else {
      superadmin.role = "superadmin";
      await superadmin.save();
      console.log("Superadmin updated");
    }

    // Create a normal user
    let normalUser = await User.findOne({ email: "user@example.com" });
    if (!normalUser) {
      normalUser = new User({
        name: "Normal User",
        email: "user@example.com",
        password: hashedPassword,
        role: "user"
      });
      await normalUser.save();
      console.log("Normal user seeded");
    }

    mongoose.connection.close();
    console.log("Finished seeding");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedTestUsers();

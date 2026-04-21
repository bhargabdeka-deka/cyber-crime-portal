require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function enableAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connected");

    const result = await User.updateMany({}, { $set: { isDisabled: false } });
    console.log(`Enabled ${result.modifiedCount} users`);

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

enableAllUsers();

const mongoose = require("mongoose");
require("dotenv").config();

const Complaint = require("./models/Complaint");
const Scam = require("./models/Scam");

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const target = "9876543210";
  const reports = await Complaint.countDocuments({ scamTarget: target });
  const scam = await Scam.findOne({ value: target });
  console.log(`Target: ${target}`);
  console.log(`Complaint Count: ${reports}`);
  console.log(`Scam Doc Reports: ${scam?.reports}`);
  console.log(`Scam Doc Risk Score: ${scam?.avgRiskScore}`);
  console.log(`Scam Doc Severity: ${scam?.riskLevel}`);
  mongoose.disconnect();
}

check();

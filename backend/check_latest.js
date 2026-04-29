const mongoose = require("mongoose");
require("dotenv").config();

const Complaint = require("./models/Complaint");

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const latest = await Complaint.find().sort({ createdAt: -1 }).limit(5);
  latest.forEach(c => {
    console.log(`Case ID: ${c.caseId}`);
    console.log(`AI Category: ${c.aiCategory}`);
    console.log(`AI Risk Score: ${c.aiRiskScore}`);
    console.log(`Risk Score: ${c.riskScore}`);
    console.log("---");
  });
  mongoose.disconnect();
}

check();

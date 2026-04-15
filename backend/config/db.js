const mongoose = require("mongoose");

// ── Auto-seed runs once when DB is empty ─────────────────────────────────────
const autoSeed = async () => {
  try {
    const Scam = require("../models/Scam");
    const count = await Scam.countDocuments();
    if (count > 0) {
      console.log(`✅ Scam DB already has ${count} records — skipping seed`);
      return;
    }

    const seedData = [
      { value: "9876543210",            type: "phone", category: "UPI Fraud",        description: "Caller pretends to be SBI officer, asks for OTP to unblock account.", reports: 14, riskLevel: "CRITICAL", avgRiskScore: 88, locations: ["Guwahati","Delhi","Mumbai"] },
      { value: "8765432109",            type: "phone", category: "Job Scam",         description: "Fake job offer from Amazon India, asks for ₹2000 registration fee.",   reports: 9,  riskLevel: "HIGH",     avgRiskScore: 76, locations: ["Bangalore","Hyderabad"] },
      { value: "7654321098",            type: "phone", category: "Lottery Scam",     description: "Claims you won ₹25 lakh in KBC lottery. Asks for processing fee.",     reports: 11, riskLevel: "CRITICAL", avgRiskScore: 91, locations: ["Kolkata","Chennai"] },
      { value: "9123456780",            type: "phone", category: "Investment Scam",  description: "Promises 40% monthly returns on crypto. Disappears after deposit.",     reports: 6,  riskLevel: "HIGH",     avgRiskScore: 82, locations: ["Mumbai","Ahmedabad"] },
      { value: "9988776655",            type: "phone", category: "UPI Fraud",        description: "Sends ₹1 then asks you to accept ₹50,000 — actually a debit request.", reports: 18, riskLevel: "CRITICAL", avgRiskScore: 94, locations: ["Guwahati","Silchar"] },
      { value: "fake-jobs.com",         type: "url",   category: "Job Scam",         description: "Fake job portal collecting personal data and charging fees.",           reports: 8,  riskLevel: "HIGH",     avgRiskScore: 79, locations: ["Bangalore","Pune"] },
      { value: "sbi-kyc-update.com",    type: "url",   category: "Phishing",         description: "Fake SBI website stealing net banking credentials.",                    reports: 22, riskLevel: "CRITICAL", avgRiskScore: 96, locations: ["Delhi","Mumbai","Chennai"] },
      { value: "free-iphone-winner.in", type: "url",   category: "Lottery Scam",     description: "Fake prize website collecting personal info and payment.",              reports: 7,  riskLevel: "HIGH",     avgRiskScore: 83, locations: ["Mumbai","Surat"] },
      { value: "crypto-double.net",     type: "url",   category: "Investment Scam",  description: "Claims to double your Bitcoin in 24 hours. Classic Ponzi scheme.",     reports: 13, riskLevel: "CRITICAL", avgRiskScore: 92, locations: ["Bangalore","Pune"] },
      { value: "paytm-cashback-offer.xyz", type: "url", category: "Phishing",        description: "Fake Paytm cashback page stealing UPI PIN.",                           reports: 5,  riskLevel: "HIGH",     avgRiskScore: 77, locations: ["Delhi","Jaipur"] },
      { value: "lottery@scam.in",       type: "email", category: "Lottery Scam",     description: "Mass email claiming recipient won international lottery.",              reports: 16, riskLevel: "CRITICAL", avgRiskScore: 89, locations: ["Pan India"] },
      { value: "hr@fake-amazon-jobs.com", type: "email", category: "Job Scam",       description: "Fake Amazon HR email offering WFH jobs. Collects Aadhaar and fee.",    reports: 10, riskLevel: "CRITICAL", avgRiskScore: 85, locations: ["Bangalore","Delhi"] },
      { value: "support@sbi-helpdesk.net", type: "email", category: "Phishing",      description: "Fake SBI support email asking to update KYC via malicious link.",      reports: 4,  riskLevel: "MEDIUM",   avgRiskScore: 71, locations: ["Mumbai","Delhi"] },
      { value: "cashback@ybl",          type: "upi",   category: "UPI Fraud",        description: "Sends fake cashback request. Victims accidentally approve debit.",      reports: 12, riskLevel: "CRITICAL", avgRiskScore: 90, locations: ["Delhi","Noida"] },
      { value: "prize.winner@paytm",    type: "upi",   category: "Lottery Scam",     description: "Fake prize UPI ID. Asks for tax payment before releasing prize.",       reports: 7,  riskLevel: "HIGH",     avgRiskScore: 81, locations: ["Mumbai","Pune"] },
      { value: "8234567891",            type: "phone", category: "Account Hacking",  description: "Sends fake OTP and asks you to share it to verify your account.",       reports: 3,  riskLevel: "MEDIUM",   avgRiskScore: 65, locations: ["Delhi"] },
    ];

    await Scam.insertMany(
      seedData.map(d => ({ ...d, lastReportedAt: new Date(), relatedCaseIds: [] }))
    );
    console.log(`🌱 Auto-seeded ${seedData.length} scam records into DB`);
  } catch (err) {
    console.error("⚠️  Auto-seed failed (non-critical):", err.message);
  }
};

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");

    // Run auto-seed after connection — safe to call every startup
    await autoSeed();

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

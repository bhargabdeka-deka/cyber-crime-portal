/**
 * CyberShield — Seed Script
 * Run: node seed.js
 * Seeds the Scam intelligence database with realistic sample data.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Scam = require("./models/Scam");

const seedData = [
  // ── PHONE NUMBERS ──────────────────────────────────────────────────────────
  {
    value: "9876543210",
    type: "phone",
    category: "UPI Fraud",
    description: "Caller pretends to be SBI bank officer, asks for OTP to unblock account.",
    reports: 14,
    riskLevel: "CRITICAL",
    avgRiskScore: 88,
    locations: ["Guwahati", "Delhi", "Mumbai"],
  },
  {
    value: "8765432109",
    type: "phone",
    category: "Job Scam",
    description: "Fake job offer from 'Amazon India', asks for registration fee of ₹2000.",
    reports: 9,
    riskLevel: "HIGH",
    avgRiskScore: 76,
    locations: ["Bangalore", "Hyderabad"],
  },
  {
    value: "7654321098",
    type: "phone",
    category: "Lottery Scam",
    description: "Claims you won ₹25 lakh in KBC lottery. Asks for processing fee.",
    reports: 11,
    riskLevel: "CRITICAL",
    avgRiskScore: 91,
    locations: ["Kolkata", "Chennai", "Pune"],
  },
  {
    value: "9123456780",
    type: "phone",
    category: "Investment Scam",
    description: "Promises 40% monthly returns on crypto investment. Disappears after deposit.",
    reports: 6,
    riskLevel: "HIGH",
    avgRiskScore: 82,
    locations: ["Mumbai", "Ahmedabad"],
  },
  {
    value: "8234567891",
    type: "phone",
    category: "Account Hacking",
    description: "Sends fake OTP and asks you to share it to 'verify your account'.",
    reports: 3,
    riskLevel: "MEDIUM",
    avgRiskScore: 65,
    locations: ["Delhi"],
  },
  {
    value: "9988776655",
    type: "phone",
    category: "UPI Fraud",
    description: "Sends ₹1 and then asks you to 'accept' ₹50,000 — actually a debit request.",
    reports: 18,
    riskLevel: "CRITICAL",
    avgRiskScore: 94,
    locations: ["Guwahati", "Silchar", "Jorhat"],
  },

  // ── URLs ───────────────────────────────────────────────────────────────────
  {
    value: "fake-jobs.com",
    type: "url",
    category: "Job Scam",
    description: "Fake job portal collecting personal data and charging registration fees.",
    reports: 8,
    riskLevel: "HIGH",
    avgRiskScore: 79,
    locations: ["Bangalore", "Pune", "Hyderabad"],
  },
  {
    value: "sbi-kyc-update.com",
    type: "url",
    category: "Phishing",
    description: "Fake SBI website stealing net banking credentials and card details.",
    reports: 22,
    riskLevel: "CRITICAL",
    avgRiskScore: 96,
    locations: ["Delhi", "Mumbai", "Chennai", "Kolkata"],
  },
  {
    value: "free-iphone-winner.in",
    type: "url",
    category: "Lottery Scam",
    description: "Fake prize website. Collects personal info and payment for 'delivery charges'.",
    reports: 7,
    riskLevel: "HIGH",
    avgRiskScore: 83,
    locations: ["Mumbai", "Surat"],
  },
  {
    value: "crypto-double.net",
    type: "url",
    category: "Investment Scam",
    description: "Claims to double your Bitcoin in 24 hours. Classic Ponzi scheme.",
    reports: 13,
    riskLevel: "CRITICAL",
    avgRiskScore: 92,
    locations: ["Bangalore", "Hyderabad", "Pune"],
  },
  {
    value: "paytm-cashback-offer.xyz",
    type: "url",
    category: "Phishing",
    description: "Fake Paytm cashback page stealing UPI PIN and wallet credentials.",
    reports: 5,
    riskLevel: "HIGH",
    avgRiskScore: 77,
    locations: ["Delhi", "Jaipur"],
  },

  // ── EMAIL ──────────────────────────────────────────────────────────────────
  {
    value: "lottery@scam.in",
    type: "email",
    category: "Lottery Scam",
    description: "Mass email claiming recipient won international lottery. Asks for bank details.",
    reports: 16,
    riskLevel: "CRITICAL",
    avgRiskScore: 89,
    locations: ["Pan India"],
  },
  {
    value: "hr@fake-amazon-jobs.com",
    type: "email",
    category: "Job Scam",
    description: "Fake Amazon HR email offering work-from-home jobs. Collects Aadhaar and fee.",
    reports: 10,
    riskLevel: "CRITICAL",
    avgRiskScore: 85,
    locations: ["Bangalore", "Delhi", "Guwahati"],
  },
  {
    value: "support@sbi-helpdesk.net",
    type: "email",
    category: "Phishing",
    description: "Fake SBI support email asking to update KYC via malicious link.",
    reports: 4,
    riskLevel: "MEDIUM",
    avgRiskScore: 71,
    locations: ["Mumbai", "Delhi"],
  },

  // ── UPI IDs ────────────────────────────────────────────────────────────────
  {
    value: "cashback@ybl",
    type: "upi",
    category: "UPI Fraud",
    description: "Sends fake cashback request. Victims accidentally approve debit.",
    reports: 12,
    riskLevel: "CRITICAL",
    avgRiskScore: 90,
    locations: ["Delhi", "Noida", "Gurgaon"],
  },
  {
    value: "prize.winner@paytm",
    type: "upi",
    category: "Lottery Scam",
    description: "Fake prize UPI ID. Asks for small 'tax payment' before releasing prize money.",
    reports: 7,
    riskLevel: "HIGH",
    avgRiskScore: 81,
    locations: ["Mumbai", "Pune"],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    let inserted = 0;
    let skipped  = 0;

    for (const item of seedData) {
      const exists = await Scam.findOne({ value: item.value });
      if (exists) {
        console.log(`⏭  Skipped (already exists): ${item.value}`);
        skipped++;
        continue;
      }
      await Scam.create({
        ...item,
        lastReportedAt: new Date(),
        relatedCaseIds: []
      });
      console.log(`✅ Inserted: ${item.value} (${item.category}, ${item.reports} reports)`);
      inserted++;
    }

    console.log(`\n🎉 Done! Inserted: ${inserted}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();

const Complaint = require("../models/Complaint");
const analyzeComplaint = require("../utils/riskAnalyzer");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");

// ================= CREATE =================
const createComplaintService = async (userId, title, description, file) => {
   console.log("🔥 FILE OBJECT RECEIVED:", file);  // 👈 ADD THIS LINE
  const caseId = "CASE-" + Date.now();

  const { crimeType, riskScore, priority } =
    analyzeComplaint(title, description);

  const complaint = new Complaint({
    caseId,
    user: userId,
    title,
    description,
    crimeType,
    riskScore,
    priority,
    // ✅ Cloudinary URL stored directly
    evidence: file ? (file.path || file.secure_url || file.url) : null
  });

  const savedComplaint = await complaint.save();

  // 🔥 EMAIL ALERT FOR CRITICAL CASE
  if (savedComplaint.riskScore >= 80) {
    console.log("🚨 Critical case detected");
    console.log("Risk Score:", savedComplaint.riskScore);

    sendEmail(
      "🚨 Critical Cyber Crime Alert",
      `
A critical complaint has been submitted.

Case ID: ${savedComplaint.caseId}
Crime Type: ${savedComplaint.crimeType}
Risk Score: ${savedComplaint.riskScore}
Priority: ${savedComplaint.priority}

Please log in to the admin dashboard immediately.
`
    )
      .then(() => {
        console.log("📧 Email sent successfully");
      })
      .catch((err) => {
        console.error("❌ Email failed:", err.message);
      });
  } else {
    console.log("ℹ️ Complaint not critical. No email sent.");
    console.log("Risk Score:", savedComplaint.riskScore);
  }

  return savedComplaint;
};

// ================= USER COMPLAINTS =================
const getUserComplaintsService = async (userId) => {
  return await Complaint.find({ user: userId });
};

// ================= ADMIN: FILTER + PAGINATION =================
// ================= ADMIN: FILTER + PAGINATION =================
const getAllComplaintsService = async (queryParams) => {
  let {
    priority,
    status,
    crimeType,
    search,
    page = 1,
    limit = 10,
    sort = "-createdAt"
  } = queryParams;

  // ✅ Convert page & limit to numbers safely
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filter = {};

  if (priority && priority.trim() !== "") {
    filter.priority = priority;
  }

  if (status && status.trim() !== "") {
    filter.status = status;
  }

  if (crimeType && crimeType.trim() !== "") {
    filter.crimeType = crimeType;
  }

  if (search && search.trim() !== "") {
    filter.caseId = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const complaints = await Complaint.find(filter)
    .populate("user", "name email")
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const total = await Complaint.countDocuments(filter);

  return {
    total,
    page,
    pages: Math.ceil(total / limit),
    complaints
  };
};
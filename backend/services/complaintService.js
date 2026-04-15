const Complaint = require("../models/Complaint");
const analyzeComplaint = require("../utils/riskAnalyzer");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");

// ================= CREATE =================
const createComplaintService = async (userId, title, description, file) => {
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
    evidence: file ? (file.path || file.secure_url || file.url) : null
  });

  const savedComplaint = await complaint.save();

  if (savedComplaint.riskScore >= 80) {
    sendEmail(
      "🚨 Critical Cyber Crime Alert",
      `
A critical complaint has been submitted.

Case ID: ${savedComplaint.caseId}
Crime Type: ${savedComplaint.crimeType}
Risk Score: ${savedComplaint.riskScore}
Priority: ${savedComplaint.priority}
`
    ).catch(() => {});
  }

  return savedComplaint;
};

// ================= USER COMPLAINTS =================
const getUserComplaintsService = async (userId) => {
  return await Complaint.find({ user: userId });
};

// ================= ADMIN LIST =================
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

  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;

  const filter = {};

  if (priority && priority.trim() !== "") filter.priority = priority;
  if (status && status.trim() !== "") filter.status = status;
  if (crimeType && crimeType.trim() !== "") filter.crimeType = crimeType;
  if (search && search.trim() !== "")
    filter.caseId = { $regex: search, $options: "i" };

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

// ================= UPDATE STATUS =================
const updateComplaintStatusService = async (id, status) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }

  const complaint = await Complaint.findById(id);
  if (!complaint) throw new Error("Complaint not found");

  complaint.status = status;
  return await complaint.save();
};

// ================= DASHBOARD STATS =================
const getDashboardStatsService = async () => {
  const totalComplaints = await Complaint.countDocuments();
  const criticalCases = await Complaint.countDocuments({ priority: "Critical" });
  const pendingCases = await Complaint.countDocuments({ status: "Pending" });

  return {
    totalComplaints,
    criticalCases,
    pendingCases
  };
};

// ================= ANALYTICS =================
const getAnalyticsService = async () => {
  const monthlyTrend = await Complaint.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const formattedMonthlyTrend = monthlyTrend.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
    count: item.count
  }));

  const crimeDistribution = await Complaint.aggregate([
    { $group: { _id: "$crimeType", count: { $sum: 1 } } }
  ]);

  const formattedCrimeDistribution = crimeDistribution.map(item => ({
    crimeType: item._id,
    count: item.count
  }));

  const statusDistribution = await Complaint.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const formattedStatusDistribution = statusDistribution.map(item => ({
    status: item._id,
    count: item.count
  }));

  const priorityDistribution = await Complaint.aggregate([
    { $group: { _id: "$priority", count: { $sum: 1 } } }
  ]);

  const formattedPriorityDistribution = priorityDistribution.map(item => ({
    priority: item._id,
    count: item.count
  }));

  const criticalCases = await Complaint.countDocuments({ priority: "Critical" });

  return {
    monthlyTrend: formattedMonthlyTrend,
    crimeDistribution: formattedCrimeDistribution,
    statusDistribution: formattedStatusDistribution,
    priorityDistribution: formattedPriorityDistribution,
    criticalCases
  };
};

module.exports = {
  createComplaintService,
  getUserComplaintsService,
  getAllComplaintsService,
  updateComplaintStatusService,
  getDashboardStatsService,
  getAnalyticsService
};
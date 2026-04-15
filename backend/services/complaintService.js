const Complaint = require("../models/Complaint");
const analyzeComplaint = require("../utils/riskAnalyzer");
const mongoose = require("mongoose");
const sendEmail = require("../utils/sendEmail");
const { upsertScamIntelligence } = require("../controllers/scamController");

// ================= CREATE =================
const createComplaintService = async (userId, title, description, file, extras = {}) => {
  const caseId = "CASE-" + Date.now();
  const { crimeType, scamType, riskScore, priority } = analyzeComplaint(title, description);

  const complaint = new Complaint({
    caseId,
    user: userId,
    title,
    description,
    crimeType,
    scamType: extras.scamType || scamType,
    scamTarget: extras.scamTarget || "",
    location: extras.location || "",
    riskScore,
    priority,
    evidence: file ? (file.path || file.secure_url || file.url) : null
  });

  const saved = await complaint.save();

  // ── Update Scam Intelligence DB ──────────────────────────────────────────
  if (extras.scamTarget) {
    upsertScamIntelligence({
      value:       extras.scamTarget,
      category:    extras.scamType || scamType,
      description: description.slice(0, 200),
      riskScore,
      caseId:      saved.caseId,
      location:    extras.location || ""
    }).catch(() => {}); // non-blocking
  }

  if (saved.riskScore >= 80) {
    sendEmail(
      "🚨 Critical Cyber Crime Alert",
      `Case ID: ${saved.caseId}\nCrime Type: ${saved.crimeType}\nScam Type: ${saved.scamType}\nRisk Score: ${saved.riskScore}\nTarget: ${saved.scamTarget || "N/A"}`
    ).catch(() => {});
  }

  return saved;
};

// ================= USER COMPLAINTS =================
const getUserComplaintsService = async (userId) => {
  return await Complaint.find({ user: userId }).sort({ createdAt: -1 });
};

// ================= ADMIN LIST =================
const getAllComplaintsService = async (queryParams) => {
  let { priority, status, crimeType, search, page = 1, limit = 10, sort = "-createdAt" } = queryParams;
  page  = parseInt(page)  || 1;
  limit = parseInt(limit) || 10;

  const filter = {};
  if (priority  && priority.trim())  filter.priority  = priority;
  if (status    && status.trim())    filter.status    = status;
  if (crimeType && crimeType.trim()) filter.crimeType = crimeType;
  if (search    && search.trim())    filter.$or = [
    { caseId:      { $regex: search, $options: "i" } },
    { scamTarget:  { $regex: search, $options: "i" } },
    { title:       { $regex: search, $options: "i" } }
  ];

  const skip = (page - 1) * limit;
  const complaints = await Complaint.find(filter)
    .populate("user", "name email")
    .sort(sort).skip(skip).limit(limit);
  const total = await Complaint.countDocuments(filter);

  return { total, page, pages: Math.ceil(total / limit), complaints };
};

// ================= UPDATE STATUS =================
const updateComplaintStatusService = async (id, status) => {
  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("Invalid ID format");
  const complaint = await Complaint.findById(id);
  if (!complaint) throw new Error("Complaint not found");
  complaint.status = status;
  return await complaint.save();
};

// ================= DASHBOARD STATS =================
const getDashboardStatsService = async () => {
  const totalComplaints = await Complaint.countDocuments();
  const criticalCases   = await Complaint.countDocuments({ priority: "Critical" });
  const pendingCases    = await Complaint.countDocuments({ status: "Pending" });
  return { totalComplaints, criticalCases, pendingCases };
};

// ================= ANALYTICS =================
const getAnalyticsService = async () => {
  const monthlyTrend = await Complaint.aggregate([
    { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const crimeDistribution = await Complaint.aggregate([
    { $group: { _id: "$crimeType", count: { $sum: 1 } } }
  ]);

  const statusDistribution = await Complaint.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const priorityDistribution = await Complaint.aggregate([
    { $group: { _id: "$priority", count: { $sum: 1 } } }
  ]);

  const criticalCases = await Complaint.countDocuments({ priority: "Critical" });

  return {
    monthlyTrend: monthlyTrend.map(i => ({
      month: `${i._id.year}-${String(i._id.month).padStart(2, "0")}`,
      count: i.count
    })),
    crimeDistribution:  crimeDistribution.map(i  => ({ crimeType: i._id, count: i.count })),
    statusDistribution: statusDistribution.map(i  => ({ status: i._id,    count: i.count })),
    priorityDistribution: priorityDistribution.map(i => ({ priority: i._id, count: i.count })),
    criticalCases
  };
};

// ================= SCAM CHECKER (PUBLIC) =================
const checkScamService = async (query) => {
  if (!query || query.trim().length < 3) throw new Error("Query too short");

  const q = query.trim();
  const reports = await Complaint.find({
    scamTarget: { $regex: q, $options: "i" }
  })
    .select("caseId scamType crimeType riskScore priority createdAt location title")
    .sort({ createdAt: -1 })
    .limit(20);

  const reportCount = reports.length;

  let verdict = "safe";
  let verdictLabel = "No Reports Found";
  let verdictColor = "#10b981";

  if (reportCount >= 5)      { verdict = "dangerous"; verdictLabel = "Highly Dangerous"; verdictColor = "#ef4444"; }
  else if (reportCount >= 2) { verdict = "warning";   verdictLabel = "Suspicious";       verdictColor = "#f59e0b"; }
  else if (reportCount >= 1) { verdict = "caution";   verdictLabel = "Reported Once";    verdictColor = "#f59e0b"; }

  const avgRisk = reportCount > 0
    ? Math.round(reports.reduce((s, r) => s + r.riskScore, 0) / reportCount)
    : 0;

  const scamTypes = [...new Set(reports.map(r => r.scamType).filter(Boolean))];

  return { query: q, reportCount, verdict, verdictLabel, verdictColor, avgRisk, scamTypes, reports };
};

// ================= TRENDING SCAMS (PUBLIC) =================
const getTrendingScamsService = async () => {
  // Top scam targets by report count
  const topTargets = await Complaint.aggregate([
    { $match: { scamTarget: { $ne: "" } } },
    { $group: { _id: "$scamTarget", count: { $sum: 1 }, scamType: { $first: "$scamType" }, avgRisk: { $avg: "$riskScore" }, lastSeen: { $max: "$createdAt" } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Top scam types
  const topScamTypes = await Complaint.aggregate([
    { $group: { _id: "$scamType", count: { $sum: 1 }, avgRisk: { $avg: "$riskScore" } } },
    { $sort: { count: -1 } },
    { $limit: 6 }
  ]);

  // Recent reports (last 7 days)
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentCount = await Complaint.countDocuments({ createdAt: { $gte: since } });

  // Latest 5 complaints
  const latest = await Complaint.find()
    .select("caseId scamType crimeType riskScore priority createdAt location title")
    .sort({ createdAt: -1 })
    .limit(5);

  return {
    topTargets: topTargets.map(t => ({
      target:   t._id,
      count:    t.count,
      scamType: t.scamType,
      avgRisk:  Math.round(t.avgRisk),
      lastSeen: t.lastSeen
    })),
    topScamTypes: topScamTypes.map(t => ({
      scamType: t._id,
      count:    t.count,
      avgRisk:  Math.round(t.avgRisk)
    })),
    recentCount,
    latest
  };
};

module.exports = {
  createComplaintService,
  getUserComplaintsService,
  getAllComplaintsService,
  updateComplaintStatusService,
  getDashboardStatsService,
  getAnalyticsService,
  checkScamService,
  getTrendingScamsService
};

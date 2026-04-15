const {
  createComplaintService,
  getUserComplaintsService,
  getAllComplaintsService,
  updateComplaintStatusService,
  getDashboardStatsService,
  getAnalyticsService,
  checkScamService,
  getTrendingScamsService
} = require("../services/complaintService");

// ================= CREATE =================
const createComplaint = async (req, res) => {
  try {
    const { title, description, scamType, scamTarget, location } = req.body;
    const complaint = await createComplaintService(
      req.user.id, title, description, req.file,
      { scamType, scamTarget, location }
    );
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= USER COMPLAINTS =================
const getUserComplaints = async (req, res) => {
  try {
    const complaints = await getUserComplaintsService(req.user.id);
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADMIN: FILTER + PAGINATION =================
const getAllComplaints = async (req, res) => {
  try {
    const data = await getAllComplaintsService(req.query);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE STATUS =================
const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await updateComplaintStatusService(req.params.id, req.body.status);
    res.status(200).json({ message: "Status updated", complaint });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// ================= DASHBOARD STATS =================
const getDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ANALYTICS =================
const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await getAnalyticsService();
    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};

// ================= SCAM CHECKER (PUBLIC) =================
const checkScam = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Query is required" });
    const result = await checkScamService(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ================= TRENDING SCAMS (PUBLIC) =================
const getTrendingScams = async (req, res) => {
  try {
    const data = await getTrendingScamsService();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createComplaint, getUserComplaints, getAllComplaints,
  updateComplaintStatus, getDashboardStats, getAnalytics,
  checkScam, getTrendingScams
};

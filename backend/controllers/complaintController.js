const {
  createComplaintService,
  getUserComplaintsService,
  getAllComplaintsService,
  updateComplaintStatusService,
  getDashboardStatsService,
  getAnalyticsService
} = require("../services/complaintService");

// ================= CREATE =================
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, scamType, scamTarget, location } = req.body;
    const complaint = await createComplaintService(
      req.user.id, title, description, req.file,
      { scamType, scamTarget, location }
    );
    res.status(201).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// ================= USER COMPLAINTS =================
const getUserComplaints = async (req, res, next) => {
  try {
    const complaints = await getUserComplaintsService(req.user.id);
    res.status(200).json({ success: true, complaints });
  } catch (error) {
    next(error);
  }
};

// ================= ADMIN: FILTER + PAGINATION =================
const getAllComplaints = async (req, res, next) => {
  try {
    const data = await getAllComplaintsService(req.query);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
};

// ================= UPDATE STATUS =================
const updateComplaintStatus = async (req, res, next) => {
  try {
    const complaint = await updateComplaintStatusService(req.params.id, req.body.status);
    res.status(200).json({ success: true, message: "Status updated", complaint });
  } catch (error) {
    next(error);
  }
};

// ================= DASHBOARD STATS =================
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

// ================= ANALYTICS =================
const getAnalytics = async (req, res, next) => {
  try {
    const analytics = await getAnalyticsService();
    res.status(200).json({ success: true, analytics });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint, getUserComplaints, getAllComplaints,
  updateComplaintStatus, getDashboardStats, getAnalytics
};

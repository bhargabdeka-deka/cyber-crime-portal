const {
  createComplaintService,
  getUserComplaintsService,
  getAllComplaintsService,
  updateComplaintStatusService,
  getDashboardStatsService,
  getAnalyticsService
} = require("../services/complaintService");

// ================= CREATE =================
// const createComplaint = async (req, res,) => {
//   try {
//     const { title, description } = req.body;

//     const complaint = await createComplaintService(
//       req.user.id,
//       title,
//       description,
//       req.file
//     );

//     res.status(201).json(complaint);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
const createComplaint = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, description } = req.body;

    const complaint = await createComplaintService(
      req.user.id,
      title,
      description,
      req.file
    );

    res.status(201).json(complaint);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= USER COMPLAINTS =================
const getUserComplaints = async (req, res) => {
  try {
    const complaints = await getUserComplaintsService(req.user.id);
    res.status(200).json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= ADMIN: FILTER + PAGINATION =================
const getAllComplaints = async (req, res) => {
  try {
    const data = await getAllComplaintsService(req.query);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= UPDATE STATUS =================
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await updateComplaintStatusService(
      req.params.id,
      status
    );

    res.status(200).json({
      message: "Status updated",
      complaint
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

// ================= DASHBOARD STATS =================
const getDashboardStats = async (req, res) => {
  try {
    const stats = await getDashboardStatsService();
    res.status(200).json(stats);
  } catch (error) {
    console.error(error);
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


module.exports = {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getDashboardStats,
  getAnalytics
};

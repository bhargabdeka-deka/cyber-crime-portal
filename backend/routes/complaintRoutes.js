const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  validateComplaint,
  validateStatusUpdate,
  handleValidationErrors
} = require("../validators/complaintValidator");

const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getDashboardStats,
  getAnalytics
} = require("../controllers/complaintController");

const upload = require("../middleware/uploadMiddleware");
const Complaint = require("../models/Complaint"); // ✅ Added

const router = express.Router();

// ================= USER ROUTES =================

// Create Complaint
router.post(
  "/",
  protect,
  upload.single("evidence"),
  validateComplaint,
  handleValidationErrors,
  createComplaint
);

// Get logged-in user's complaints
router.get("/my", protect, getUserComplaints);

// ✅ NEW ROUTE — Get Single Complaint by ID (User Only)
router.get("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Ensure user owns the complaint
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(complaint);
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ADMIN ROUTES =================

// Dashboard stats
router.get("/stats", protect, adminOnly, getDashboardStats);

// Analytics
router.get("/analytics", protect, adminOnly, getAnalytics);

// Get all complaints (Admin only)
router.get("/", protect, adminOnly, getAllComplaints);

// Update complaint status (Admin only)
router.put(
  "/:id/status",
  protect,
  adminOnly,
  validateStatusUpdate,
  handleValidationErrors,
  updateComplaintStatus
);

module.exports = router;
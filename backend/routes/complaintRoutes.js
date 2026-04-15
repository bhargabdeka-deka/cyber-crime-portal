const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { validateComplaint, validateStatusUpdate, handleValidationErrors } = require("../validators/complaintValidator");
const {
  createComplaint, getUserComplaints, getAllComplaints,
  updateComplaintStatus, getDashboardStats, getAnalytics,
  checkScam, getTrendingScams
} = require("../controllers/complaintController");
const upload = require("../middleware/uploadMiddleware");
const Complaint = require("../models/Complaint");

const router = express.Router();

// ── PUBLIC (no auth needed) ──────────────────────────────
router.get("/check",    checkScam);        // GET /api/complaints/check?query=9876543210
router.get("/trending", getTrendingScams); // GET /api/complaints/trending

// ── USER ─────────────────────────────────────────────────
router.post("/", protect, upload.single("evidence"), validateComplaint, handleValidationErrors, createComplaint);
router.get("/my", protect, getUserComplaints);

// ── ADMIN ─────────────────────────────────────────────────
router.get("/stats",     protect, adminOnly, getDashboardStats);
router.get("/analytics", protect, adminOnly, getAnalytics);
router.get("/",          protect, adminOnly, getAllComplaints);
router.put("/:id/status", protect, adminOnly, validateStatusUpdate, handleValidationErrors, updateComplaintStatus);

// ── DYNAMIC (must be last) ────────────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    if (complaint.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    res.json(complaint);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

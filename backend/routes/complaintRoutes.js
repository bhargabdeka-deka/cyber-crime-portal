const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { validateComplaint, validateStatusUpdate, handleValidationErrors } = require("../validators/complaintValidator");
const {
  createComplaint, getUserComplaints, getAllComplaints,
  updateComplaintStatus, getDashboardStats, getAnalytics
} = require("../controllers/complaintController");
const upload = require("../middleware/uploadMiddleware");
const Complaint = require("../models/Complaint");

const router = express.Router();

// ── USER ─────────────────────────────────────────────────
router.post("/", protect, upload.single("evidence"), validateComplaint, handleValidationErrors, createComplaint);
router.get("/my", protect, getUserComplaints);

// ── ADMIN ─────────────────────────────────────────────────
router.get("/stats",     protect, adminOnly, getDashboardStats);
router.get("/analytics", protect, adminOnly, getAnalytics);
router.get("/",          protect, adminOnly, getAllComplaints);
router.put("/:id/status", protect, adminOnly, validateStatusUpdate, handleValidationErrors, updateComplaintStatus);

// ── EXPORT CSV ────────────────────────────────────────────
router.get("/export/csv", protect, adminOnly, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email").sort({ createdAt: -1 });
    const header = "Case ID,User,Email,Title,Crime Type,Scam Type,Priority,Risk Score,Status,Location,Date\n";
    const rows = complaints.map(c =>
      [c.caseId, c.user?.name||"", c.user?.email||"",
       `"${(c.title||"").replace(/"/g,'""')}"`,
       c.crimeType, c.scamType, c.priority, c.riskScore,
       c.status, c.location||"",
       new Date(c.createdAt).toLocaleDateString("en-IN")].join(",")
    ).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=cybershield-${Date.now()}.csv`);
    res.send(header + rows);
  } catch {
    res.status(500).json({ message: "Export failed" });
  }
});

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

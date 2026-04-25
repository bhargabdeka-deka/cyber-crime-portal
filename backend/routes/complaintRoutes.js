const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { validateComplaint, validateStatusUpdate, handleValidationErrors, evidenceRequired } = require("../validators/complaintValidator");
const {
  createComplaint, getUserComplaints, getAllComplaints,
  updateComplaintStatus, getDashboardStats, getAnalytics
} = require("../controllers/complaintController");
const upload = require("../middleware/uploadMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const Complaint = require("../models/Complaint");

const router = express.Router();

// ── USER ─────────────────────────────────────────────────
router.post("/", protect, upload.single("evidence"), evidenceRequired, validateComplaint, handleValidationErrors, createComplaint);
router.get("/my", protect, getUserComplaints);



// ── ADMIN ─────────────────────────────────────────────────
router.get("/stats",     protect, authorizeRoles("admin", "superadmin"), getDashboardStats);
router.get("/analytics", protect, authorizeRoles("admin", "superadmin"), getAnalytics);
router.get("/",          protect, authorizeRoles("admin", "superadmin"), getAllComplaints);
router.put("/:id/status", protect, authorizeRoles("admin", "superadmin"), validateStatusUpdate, handleValidationErrors, updateComplaintStatus);

// ── EXPORT CSV ────────────────────────────────────────────
router.get("/export/csv", protect, authorizeRoles("admin", "superadmin"), async (req, res, next) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email").sort({ createdAt: -1 });

    const header = [
      "Case ID", "User", "Email", "Title", "Crime Type",
      "Scam Type", "Priority", "Risk Score", "Status", "Location", "Date"
    ].map(h => `"${h}"`).join(",") + "\n";

    const rows = complaints.map(c => {
      const rowData = [
        c.caseId,
        c.user?.name || "N/A",
        c.user?.email || "N/A",
        (c.title || "").replace(/"/g, '""'),
        c.crimeType,
        c.scamType || "N/A",
        c.priority,
        c.riskScore,
        c.status,
        c.location || "N/A",
        new Date(c.createdAt).toISOString().replace("T", " ").slice(0, 19)
      ];
      return rowData.map(val => `"${val}"`).join(",");
    }).join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=complaints_${Date.now()}.csv`);

    // Add UTF-8 BOM for Excel compatibility (CRITICAL)
    const BOM = "\uFEFF";
    res.status(200).send(BOM + header + rows);
  } catch (error) {
    next(error);
  }
});

// ── DYNAMIC (must be last) ────────────────────────────────
router.get("/:id", protect, async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    if (complaint.user.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "superadmin")
      return res.status(403).json({ message: "Not authorized to view this report" });
    res.json(complaint);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

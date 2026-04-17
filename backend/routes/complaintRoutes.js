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

// ── ANONYMOUS REPORT (no login needed) ───────────────────
router.post("/anonymous", upload.single("evidence"), async (req, res) => {
  try {
    const { title, description, scamType, scamTarget, location } = req.body;
    if (!title || title.trim().length < 5) return res.status(400).json({ message: "Title must be at least 5 characters" });
    if (!description || description.trim().length < 10) return res.status(400).json({ message: "Description must be at least 10 characters" });

    const analyzeComplaint = require("../utils/riskAnalyzer");
    const { upsertScamIntelligence } = require("../controllers/scamController");
    const Scam = require("../models/Scam");
    const { crimeType, scamType: detectedScamType, riskScore, priority } = analyzeComplaint(title, description);

    // Use a system anonymous user ID (fixed ObjectId)
    const mongoose = require("mongoose");
    const ANON_ID = new mongoose.Types.ObjectId("000000000000000000000001");

    const complaint = new Complaint({
      caseId: "ANON-" + Date.now(),
      user: ANON_ID,
      title: title.trim(),
      description: description.trim(),
      crimeType,
      scamType: scamType || detectedScamType,
      scamTarget: scamTarget || "",
      location: location || "",
      riskScore,
      priority,
      evidence: req.file ? (req.file.path || req.file.secure_url || req.file.url) : null
    });
    await complaint.save();

    if (scamTarget) {
      upsertScamIntelligence({ value: scamTarget, category: scamType || detectedScamType, description: description.slice(0,200), riskScore, caseId: complaint.caseId, location: location || "" }).catch(() => {});
    }

    res.status(201).json({ success: true, message: "Report submitted. Thank you for helping the community!", caseId: complaint.caseId });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

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

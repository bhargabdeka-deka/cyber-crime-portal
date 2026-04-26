const {
  createComplaintService,
  getUserComplaintsService,
  getAllComplaintsService,
  updateComplaintStatusService,
  getDashboardStatsService,
  getAnalyticsService
} = require("../services/complaintService");
const User = require("../models/User");
const Complaint = require("../models/Complaint");

// ================= CREATE =================
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, scamType, scamTarget, location } = req.body;

    // ── PART 2: Trust Validation ──────────────────────────────────────
    const user = await User.findById(req.user.id);

    if (user.isDisabled) {
      return res.status(403).json({ success: false, message: "Your account has been disabled due to repeated violations." });
    }

    if (user.trustScore < 20) {
      return res.status(403).json({ success: false, message: "Your trust score is too low to submit reports. Please contact support." });
    }

    // ── PART 2: Cooldown (1 report per 60 seconds) ────────────────────
    if (user.lastReportDate) {
      const diff = Date.now() - new Date(user.lastReportDate).getTime();
      if (diff < 60000) {
        const remaining = Math.ceil((60000 - diff) / 1000);
        return res.status(429).json({ success: false, message: `Please wait ${remaining} second(s) before submitting another report.` });
      }
    }

    // ── PART 5: Duplicate report prevention ──────────────────────────
    if (scamTarget && scamTarget.trim()) {
      const existing = await Complaint.findOne({
        user: req.user.id,
        scamTarget: scamTarget.trim()
      });
      if (existing) {
        return res.status(400).json({ success: false, message: "You have already reported this target." });
      }
    }

    // ── PART 6: Max 3 reports per day ──────────────────────────────
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayCount = await Complaint.countDocuments({
      user: req.user.id,
      createdAt: { $gte: startOfDay }
    });
    if (todayCount >= 3) {
      return res.status(429).json({ success: false, message: "You have reached the maximum of 3 reports per day. Please try again tomorrow." });
    }

    // ── PART 7: Evidence validation (description ≥ 20 chars) ─────────────
    if (!description || description.trim().length < 20) {
      return res.status(400).json({ success: false, message: "Description must be at least 20 characters long." });
    }

    // ── Save the complaint ─────────────────────────────────────────
    const complaint = await createComplaintService(
      req.user.id, title, description, req.file,
      { scamType, scamTarget, location }
    );

    // ── Update user activity fields after successful report ──────────────
    // NOTE: trustScore is NOT increased on submission — only on admin approval
    user.reportCount += 1;
    user.lastReportDate = new Date();
    await user.save();

    res.status(201).json({ success: true, complaint, user });
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
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const complaintToUpdate = await Complaint.findById(id);

    if (!complaintToUpdate) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    const currentStatus = complaintToUpdate.status;

    // 🔒 1. STATUS FLOW RULE (STRICT) — Rejected added as valid transition
    const allowedTransitions = {
      Pending:      ["Investigating", "Rejected"],
      Investigating: ["Resolved", "Rejected"],
      Resolved:     []
    };

    if (currentStatus === newStatus) {
      return res.status(400).json({ success: false, message: "Complaint is already in this status" });
    }

    if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid transition from ${currentStatus} to ${newStatus}`
      });
    }

    // ── Trust score updates based on admin decision ───────────────────────
    if (newStatus === "Rejected") {
      // PENALTY: fake/invalid report → trustScore -= 15
      const reportUser = await User.findById(complaintToUpdate.user);
      if (reportUser) {
        // Part 4: safe number normalization — guard against NaN/undefined
        reportUser.trustScore = Number(reportUser.trustScore) || 0;
        reportUser.trustScore = Math.max(0, reportUser.trustScore - 15);
        if (reportUser.trustScore <= 10) {
          reportUser.isDisabled = true;
          reportUser.disabledAt = new Date();
        }
        reportUser.isTrusted = reportUser.trustScore >= 30;
        await reportUser.save();
        // Part 6: non-sensitive debug log
        console.log(`[TrustSystem] PENALTY applied — user: ${reportUser._id}, trustScore: ${reportUser.trustScore}, isDisabled: ${reportUser.isDisabled}`);
      }
    }

    if (newStatus === "Resolved") {
      // REWARD: valid report confirmed by admin → trustScore += 5
      const reportUser = await User.findById(complaintToUpdate.user);
      if (reportUser) {
        // Part 4: safe number normalization — guard against NaN/undefined
        reportUser.trustScore = Number(reportUser.trustScore) || 0;
        reportUser.trustScore = Math.min(100, reportUser.trustScore + 5);
        reportUser.isTrusted = reportUser.trustScore >= 30;
        await reportUser.save();
        // Part 6: non-sensitive debug log
        console.log(`[TrustSystem] REWARD applied — user: ${reportUser._id}, trustScore: ${reportUser.trustScore}, isTrusted: ${reportUser.isTrusted}`);
      }
    }

    const updatedComplaint = await updateComplaintStatusService(id, newStatus);
    res.status(200).json({ 
      success: true, 
      message: "Status updated successfully", 
      complaint: updatedComplaint 
    });
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

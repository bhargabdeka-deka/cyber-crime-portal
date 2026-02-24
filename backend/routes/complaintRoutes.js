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

const router = express.Router();

// ================= USER ROUTES =================
router.post(
  "/",
  protect,
  upload.single("evidence"),
  validateComplaint,
  handleValidationErrors,
  createComplaint
);

router.get("/my", protect, getUserComplaints);

// ================= ADMIN ROUTES =================
router.get("/stats", protect, adminOnly, getDashboardStats);

router.get(
  "/analytics",
  protect,
  adminOnly,
  getAnalytics
);

router.get("/", protect, adminOnly, getAllComplaints);

router.put(
  "/:id/status",
  protect,
  adminOnly,
  validateStatusUpdate,
  handleValidationErrors,
  updateComplaintStatus
);


module.exports = router;

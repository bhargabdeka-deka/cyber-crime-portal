const express    = require("express");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const crypto     = require("crypto");
const rateLimit  = require("express-rate-limit");
const User       = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/authorizeRoles");
const { sendEmailTo } = require("../utils/sendEmail");
const { 
  validateRegister, 
  validateLogin, 
  validateProfile, 
  validateForgotPassword,
  validateResetPassword,
  handleValidationErrors 
} = require("../validators/userValidator");

const router = express.Router();

// ── Rate limiters ─────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: { success: false, message: "Too many reset requests. Try again in 1 hour." },
});

// ================= REGISTER =================
router.post("/register", authLimiter, validateRegister, handleValidationErrors, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await new User({ name, email, password: hashedPassword }).save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
});

// ================= LOGIN =================
router.post("/login", authLimiter, validateLogin, handleValidationErrors, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    if (user.isDisabled) return res.status(403).json({ success: false, message: "Account disabled" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true, message: "Login successful", token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, bio: user.bio, avatar: user.avatar }
    });
  } catch (error) {
    next(error);
  }
});

// ================= FORGOT PASSWORD =================
router.post("/forgot-password", resetLimiter, validateForgotPassword, handleValidationErrors, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ success: true, message: "If that email exists, a reset link has been sent." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "https://cyber-crime-fronten.onrender.com"}/reset-password/${token}`;

    await sendEmailTo(email, "CyberShield — Reset Your Password",
      `<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f7fa; font-family: sans-serif;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #ffffff; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
              <tr>
                <td style="padding: 40px;">
                  <div style="margin-bottom: 32px; text-align: center;">
                    <span style="font-size: 24px; font-weight: bold; letter-spacing: -0.5px;">
                      <span style="color: #0f172a;">Cyber</span><span style="color: #2563eb;">Shield</span>
                    </span>
                  </div>
                  <h1 style="font-size: 20px; font-weight: bold; color: #0f172a; margin: 0 0 16px 0; text-align: center;">Reset Your Password</h1>
                  <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 24px 0;">Hi ${user.name},</p>
                  <p style="font-size: 15px; color: #475569; line-height: 1.6; margin: 0 0 32px 0;">We received a request to reset your password. Click the button below to reset it.</p>
                  <div style="text-align: center; margin-bottom: 32px;">
                    <a href="${resetUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px;">Reset Password</a>
                  </div>
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                    <tr>
                      <td align="center">
                        <p style="font-size: 13px; color: #94a3b8; margin: 0;">If you did not request this, ignore this email.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">&copy; 2026 CyberShield. Secure digital future.</p>
          </td>
        </tr>
      </table>`
    );

    res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (error) {
    next(error);
  }
});

// ================= RESET PASSWORD =================
router.post("/reset-password/:token", validateResetPassword, handleValidationErrors, async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findOne({ resetToken: req.params.token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired reset link" });

    user.password = await bcrypt.hash(password, await bcrypt.genSalt(10));
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
});

// ================= UPLOAD AVATAR =================
router.post("/avatar", protect, require("../middleware/uploadMiddleware").single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    user.avatar = req.file.path || req.file.secure_url || req.file.url;
    await user.save();
    res.json({ success: true, avatar: user.avatar });
  } catch (error) {
    next(error);
  }
});

// ================= UPDATE PROFILE =================
router.put("/profile", protect, validateProfile, handleValidationErrors, async (req, res) => {
  try {
    const { name, phone, location, bio } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name !== undefined)     user.name     = name;
    if (phone !== undefined)    user.phone    = phone;
    if (location !== undefined) user.location = location;
    if (bio !== undefined)      user.bio      = bio;

    await user.save();
    const updated = { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location, bio: user.bio, avatar: user.avatar };
    res.json({ success: true, message: "Profile updated", user: updated });
  } catch (error) {
    next(error);
  }
});

// ================= GET PROFILE =================
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -resetToken -resetTokenExpiry");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// ================= USER IMPACT =================
router.get("/impact", protect, async (req, res) => {
  try {
    const { getUserImpactService } = require("../services/complaintService");
    const impact = await getUserImpactService(req.user.id);
    res.json({ success: true, ...impact });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN: LIST ALL USERS =================
router.get("/", protect, authorizeRoles("admin", "superadmin"), async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = search ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }] } : {};
    const users = await User.find(filter).select("-password -resetToken -resetTokenExpiry").sort({ createdAt: -1 }).skip((page-1)*limit).limit(parseInt(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN: GET USER COMPLAINT COUNT =================
router.get("/:id/stats", protect, authorizeRoles("admin", "superadmin"), async (req, res) => {
  try {
    const Complaint = require("../models/Complaint");
    const count = await Complaint.countDocuments({ user: req.params.id });
    const highRisk = await Complaint.countDocuments({ user: req.params.id, riskScore: { $gte: 80 } });
    res.json({ success: true, total: count, highRisk });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

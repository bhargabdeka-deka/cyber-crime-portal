const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role:     { type: String, enum: ["user", "admin", "superadmin"], default: "user" },

  // ── Profile fields ──────────────────────────────────────────────────────
  phone:    { type: String, default: "" },
  location: { type: String, default: "" },
  bio:      { type: String, default: "" },
  avatar:   { type: String, default: "" },

  // ── Trust / Anti-Fake-Report fields ────────────────────────────────────────
  trustScore:     { type: Number, default: 50 },   // user=50, admin=80, superadmin=100
  reportCount:    { type: Number, default: 0 },
  lastReportDate: { type: Date },
  isTrusted:      { type: Boolean, default: false },

  // ── Status fields ────────────────────────────────────────────────────────
  isDisabled: { type: Boolean, default: false },
  disabledAt: { type: Date },
  disabledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // ── Password reset ──────────────────────────────────────────────────────
  resetToken:       { type: String },
  resetTokenExpiry: { type: Date },

  createdAt: { type: Date, default: Date.now },

  trustHistory: [
    {
      change: Number, // +5 or -15
      reason: String, // "Report Approved" / "Report Rejected"
      complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint"
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

// ── Role-based trustScore default on first save ────────────────────────────
userSchema.pre("save", function (next) {
  if (this.isNew) {
    if (this.role === "superadmin") this.trustScore = 100;
    else if (this.role === "admin") this.trustScore = 80;
    else this.trustScore = 50;
    this.isTrusted = this.trustScore >= 30;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);

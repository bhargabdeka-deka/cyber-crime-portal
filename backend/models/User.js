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

  // ── Status fields ────────────────────────────────────────────────────────
  isDisabled: { type: Boolean, default: false },
  disabledAt: { type: Date },
  disabledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // ── Password reset ──────────────────────────────────────────────────────
  resetToken:       { type: String },
  resetTokenExpiry: { type: Date },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);

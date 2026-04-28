const mongoose = require("mongoose");

// ── Scam Intelligence Collection ──────────────────────────────────────────────
// One document per unique scam target (phone / URL / UPI / email).
// Every time a complaint is filed with a scamTarget, this doc is upserted.
// This gives us a live, deduplicated intelligence database.

const scamSchema = new mongoose.Schema(
  {
    value: { type: String, required: true, unique: true, index: true }, // the phone/URL/UPI
    type:  {
      type: String,
      enum: ["phone", "url", "upi", "email", "other"],
      default: "other"
    },
    category: { type: String, default: "Other" },   // scamType from complaint
    description: { type: String, default: "" },      // latest description
    reports: { type: Number, default: 1 },           // total report count
    riskLevel: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low"
    },
    riskScore:    { type: Number, default: 0 },
    riskReasons:  [{ type: String }],
    avgRiskScore: { type: Number, default: 0 },
    lastReportedAt:  { type: Date, default: Date.now },
    locations:       [{ type: String }],             // cities/states reported from
    relatedCaseIds:  [{ type: String }]              // caseIds that reference this target
  },
  { timestamps: true }
);

// Auto-compute riskLevel from reports count
scamSchema.methods.computeRiskLevel = function () {
  if (this.reports >= 10)     return "Critical";
  if (this.reports >= 5)      return "High";
  if (this.reports >= 2)      return "Medium";
  return "Low";
};

module.exports = mongoose.model("Scam", scamSchema);

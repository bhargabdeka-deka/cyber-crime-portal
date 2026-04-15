const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    caseId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    evidence: { type: String },
    status: { type: String, default: "Pending" },

    // ── AI Classification ──
    crimeType: { type: String, default: "Unclassified" },
    riskScore: { type: Number, default: 0 },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Low" },

    // ── Scam Intelligence Fields (NEW) ──
    scamType: {
      type: String,
      enum: [
        "UPI Fraud", "Phishing", "Job Scam", "Lottery Scam",
        "Romance Scam", "Investment Scam", "Identity Theft",
        "Account Hacking", "Cyber Harassment", "Other"
      ],
      default: "Other"
    },
    scamTarget: {
      type: String,   // phone number, URL, email, or UPI ID reported
      default: ""
    },
    location: {
      type: String,   // state / city (optional, user-provided)
      default: ""
    }
  },
  { timestamps: true }
);

// Index for fast scam checker lookups
complaintSchema.index({ scamTarget: 1 });
complaintSchema.index({ scamType: 1 });
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Complaint", complaintSchema);

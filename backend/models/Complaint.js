const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    caseId: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },

    evidence: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending"
    },
    crimeType: {
      type: String,
      default: "Unclassified"
    },
    riskScore: {
      type: Number,
      default: 0
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);

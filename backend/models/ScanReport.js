const mongoose = require("mongoose");

const scanReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    websiteUrl: {
      type: String,
      required: true,
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    riskLevel: {
      type: String,
      default: "Low",
    },

    vulnerabilities: [String],

    recommendations: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ScanReport", scanReportSchema);
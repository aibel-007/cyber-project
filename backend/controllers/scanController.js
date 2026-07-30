const axios = require("axios");
const ScanReport = require("../models/ScanReport");
const PDFDocument = require("pdfkit");

// Scan Website
exports.scanWebsite = async (req, res) => {
  try {
    const { websiteUrl } = req.body;

    let vulnerabilities = [];
    let riskScore = 0;

    if (!websiteUrl) {
      return res.status(400).json({ message: "Website URL is required" });
    }

    if (!websiteUrl.startsWith("https://")) {
      vulnerabilities.push("Website is not using HTTPS");
      riskScore += 30;
    }

    const response = await axios.get(websiteUrl);
    const headers = response.headers;

    const requiredHeaders = [
      "content-security-policy",
      "x-frame-options",
      "x-content-type-options",
      "strict-transport-security",
    ];

    requiredHeaders.forEach((header) => {
      if (!headers[header]) {
        vulnerabilities.push(`Missing security header: ${header}`);
        riskScore += 10;
      }
    });

    let riskLevel = "Low";

    if (riskScore > 70) {
      riskLevel = "High";
    } else if (riskScore > 30) {
      riskLevel = "Medium";
    }

    let recommendations = [];

    if (vulnerabilities.includes("Website is not using HTTPS")) {
      recommendations.push(
        "Enable HTTPS to encrypt data between users and the website."
      );
    }

    if (vulnerabilities.some((v) => v.includes("content-security-policy"))) {
      recommendations.push(
        "Add Content-Security-Policy header to prevent XSS attacks."
      );
    }

    if (vulnerabilities.some((v) => v.includes("x-frame-options"))) {
      recommendations.push(
        "Add X-Frame-Options header to prevent clickjacking attacks."
      );
    }

    if (vulnerabilities.some((v) => v.includes("x-content-type-options"))) {
      recommendations.push(
        "Add X-Content-Type-Options header to prevent MIME sniffing attacks."
      );
    }

    if (vulnerabilities.some((v) => v.includes("strict-transport-security"))) {
      recommendations.push(
        "Add HSTS header to force secure HTTPS connections."
      );
    }

    const report = await ScanReport.create({
      userId: req.user._id,
      websiteUrl,
      riskScore,
      riskLevel,
      vulnerabilities,
      recommendations: recommendations.join(" "),
    });

    res.status(201).json({
      message: "Website scanned successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Scan failed",
      error: error.message,
    });
  }
};

// Get My Reports
exports.getMyReports = async (req, res) => {
  try {
    const reports = await ScanReport.find({
      userId: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      message: "My scan reports fetched successfully",
      reports,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

// Get Single Report By ID
exports.getReportById = async (req, res) => {
  try {
    const report = await ScanReport.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.json({
      message: "Report fetched successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch report",
      error: error.message,
    });
  }
};

// Delete Report
exports.deleteReport = async (req, res) => {
  try {
    const report = await ScanReport.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.json({
      message: "Report deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete report",
      error: error.message,
    });
  }
};

// Download Report PDF
exports.downloadReportPDF = async (req, res) => {
  try {
    const report = await ScanReport.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${report._id}.pdf`
    );

    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Cyber Security Scan Report", {
      align: "center",
    });

    doc.moveDown();

    doc.fontSize(12).text(`Website URL: ${report.websiteUrl}`);
    doc.text(`Risk Score: ${report.riskScore}`);
    doc.text(`Risk Level: ${report.riskLevel}`);

    doc.moveDown();
    doc.text("Vulnerabilities:");

    report.vulnerabilities.forEach((item) => {
      doc.text(`• ${item}`);
    });

    doc.moveDown();
    doc.text(`Recommendations: ${report.recommendations}`);

    doc.end();
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate PDF",
      error: error.message,
    });
  }
};
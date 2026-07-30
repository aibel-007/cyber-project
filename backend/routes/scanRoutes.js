const express = require("express");
const router = express.Router();

const {
  scanWebsite,
  getMyReports,
  getReportById,
  deleteReport,
  downloadReportPDF,
} = require("../controllers/scanController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, scanWebsite);

router.get("/my-reports", protect, getMyReports);

router.get("/report/:id", protect, getReportById);

router.delete("/report/:id", protect, deleteReport);

router.get("/report/:id/pdf", protect, downloadReportPDF);

module.exports = router;
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/AuthMiddleWare");
const authorize = require("../middleware/Role");
const { analyzeTodayFeedback } = require("../controller/FeedbackAnalysisController");

router.get(
  "/today",
  verifyToken,
  authorize("CHEF"),
  analyzeTodayFeedback
);

module.exports = router;

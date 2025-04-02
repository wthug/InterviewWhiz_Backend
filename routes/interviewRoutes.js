const express = require("express");
const {getUserInterviews,postInterviewData} = require("../controllers/interviewController");
const {requireAuth} = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", requireAuth, getUserInterviews);
router.post("/", requireAuth, postInterviewData);

module.exports = router;

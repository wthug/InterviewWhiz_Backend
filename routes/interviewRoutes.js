const express = require("express");
const {getUserInterviews,postInterviewData} = require("../controllers/interviewController");
const {requireAuth} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(requireAuth)

router.get("/", getUserInterviews);
router.post("/", postInterviewData);

module.exports = router;
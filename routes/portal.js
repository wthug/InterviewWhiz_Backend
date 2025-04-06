const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const { generateAnalysis } = require("../controllers/analysisController");
const { generateFeedback } = require("../controllers/feedbackController");
const { generateQuestion } = require("../controllers/questionController");
const router = express.Router();

router.use(requireAuth)

//analysis route
router.post("/analysis", generateAnalysis);

// //feedback route
// router.post("/feedback", generateFeedback);

// //generate question
// router.post("/new-question", generateQuestion);

module.exports = router;
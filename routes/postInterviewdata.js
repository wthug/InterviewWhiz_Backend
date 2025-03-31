const express = require("express");
const Interview = require("../models/interview");
const authenticate = require("../middleware/authentication");

const router = express.Router();

// Post Interview Data
router.post("/", authenticate, async (req, res) => {
  try {
    const { company, role, experience, language, codingRound } = req.body;
    const newInterview = new Interview({
      user: req.user.id,
      company,
      role,
      experience,
      language,
      codingRound,
    });

    await newInterview.save();
    res.status(201).json({ message: "Interview data saved successfully!", interviewId: newInterview._id });
  } catch (error) {
    console.error("Error saving interview data:", error);
    res.status(500).json({ message: "Failed to save interview data." });
  }
});

module.exports = router;

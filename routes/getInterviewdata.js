const express = require("express");
const Interview = require("../models/interview");
const authentication = require("../middleware/authentication");

const router = express.Router();

// Get User Interviews
router.get("/", authentication, async (req, res) => {
  try {
    const userId = req.user.id;
    const interviews = await Interview.find({ user: userId }).sort({ createdAt: -1 });

    if (!interviews || interviews.length === 0) {
      return res.status(404).json({ message: "No interviews found" });
    }

    res.status(200).json(interviews);
  } catch (error) {
    console.error("Error fetching interview data:", error);
    res.status(500).json({ message: "Error fetching interview data" });
  }
});

module.exports = router;

const Interview = require("../models/interview");

const postInterviewData = async (req, res) => {
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
};

const getUserInterviews = async (req, res) => {
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
};

const getLatestInterview = async (req, res) => {
  try {
    const userId = req.user.id;

    const interview = await Interview.findOne({  user: userId }).sort({ createdAt: -1 });
    // console.log("Interview", interview);

    if (!interview) {
      return res.status(404).json({ error: "No interviews found." });
    }

    return res.status(200).json({ interviewId: interview._id });
  } catch (err) {
    console.error("Error fetching latest interview:", err);
    res.status(500).json({ error: "Failed to fetch latest interview." });
  }
};

module.exports = { getUserInterviews, postInterviewData, getLatestInterview};

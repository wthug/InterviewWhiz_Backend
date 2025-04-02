const openai = require("../utils/openaiClient");

exports.generateFeedback = async (req, res) => {
  try {
    const { question, solution, jobRole } = req.body;

    const systemContext =
        `Assume the role of an experienced interviewer with 20+ years in technical interviews for ${jobRole} in India. Provide constructive feedback.`;
      const prompt = `Interview Question: "${question}" Candidate's Answer: "${solution}" Please provide detailed feedback on the answer regarding correctness, edge cases, efficiency, and overall performance.`;

    const feedback = await openai.createChatCompletion(systemContext, prompt);
    res.status(200).json({ feedback });
  } catch (error) {
    console.error("Error generating feedback:", error);
    res.status(500).json({ error: "Failed to generate feedback." });
  }
};

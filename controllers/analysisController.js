const fs = require("fs");
const path = require("path");
const cloudinary = require("../lib/cloudinary");
const { generatePDFReport } = require("../utils/pdfGenerator");
const Interview = require("../models/interview");
const { createChatCompletion } = require("../utils/openaiClient");
const { cleanMarkdown } = require("../utils/cleanMarkdown");

exports.generateAnalysis = async (req, res) => {
  try {
    const { feedback, interviewId, formData } = req.body;
    const { name, role, company, experience, prefferedLanguage, codingRound } =
      formData || {};

    const systemContext =
      "Assume the role of an experienced interviewer with 20+ years of experience. Provide a detailed markdown interview analysis report.";

    const prompt = `
Using the following candidate details and performance feedback, provide a complete markdown interview report.

👤 Candidate Details
- Name: ${name}
- Role: ${role}
- Company: ${company}
- Experience: ${experience} years
- Preferred Language: ${prefferedLanguage}
- Interview Type: ${codingRound ? "Technical" : "Behavioural"}

📝 Feedback Summary
${feedback}

📄 Generate the following sections in Markdown:
1. Areas Tested and Scores (each topic out of 10)
2. Overall Score (out of 10)
3. Strength Topics
4. Weakness Topics
5. Areas for Improvement
6. Interviewer Comments
7. Additional Comments

📦 At the end, return a JSON object with topic-wise scores in this format with headin Topic-wise Score:
\`\`\`json
{
  "Data Structures": 7,
  "Algorithms": 9,
  "System Design": 6
}
\`\`\`
`;

    const content = await createChatCompletion(systemContext, prompt);
    if (!content) {
      return res.status(500).json({ error: "OpenAI response is empty." });
    }

    const markdown = cleanMarkdown(content);
    console.log("📄 Cleaned Markdown:", markdown);

    const scoreMatch = markdown.match(/Overall Score\s*[:\-]?\s*(\d+(\.\d+)?)/i);
    if (!scoreMatch) {
      return res.status(500).json({ error: "Could not extract overall score." });
    }
    const overallScore = parseFloat(scoreMatch[1]);

    // Robust JSON extraction
    let topicScores = {};

    const jsonRegex = /```json\s*({[\s\S]*?})\s*```/i;
    const fallbackJsonRegex = /({[\s\S]*})$/; // fallback for AI returning plain JSON

    let rawJson = null;

    const jsonMatch = markdown.match(jsonRegex);
    if (jsonMatch && jsonMatch[1]) {
      rawJson = jsonMatch[1];
    } else {
      const fallbackMatch = markdown.match(fallbackJsonRegex);
      if (fallbackMatch && fallbackMatch[1]) {
        rawJson = fallbackMatch[1];
      }
    }

    if (rawJson) {
      try {
        topicScores = JSON.parse(rawJson.trim());
        console.log("✅ Extracted topicScores JSON:", topicScores);
      } catch (err) {
        console.error("❌ Failed to parse topicScores JSON:", err);
      }
    } else {
      console.warn("⚠️ No topicScores JSON found in markdown.");
    }


    const pdfPath = await generatePDFReport(markdown, overallScore, formData, topicScores);

    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "auto",
      public_id: `interviews/interview-report-${Date.now()}`,
    });

    const cloudinaryUrl = uploadResult.secure_url;
    fs.unlinkSync(pdfPath);

    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { pdfReport: cloudinaryUrl, score: overallScore },
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({ error: "Interview not found." });
    }

    return res.status(200).json({
      message: "Report generated and uploaded successfully.",
      pdfUrl: cloudinaryUrl,
      interviewId: updatedInterview._id,
    });
  } catch (err) {
    console.error("Error generating analysis:", err);
    res.status(500).json({ error: "Failed to generate analysis report." });
  }
};
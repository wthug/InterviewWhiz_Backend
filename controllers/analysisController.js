const fs = require('fs'); // Add this line to import fs
const path = require('path');
const cloudinary = require('../lib/cloudinary');
const { generatePDFReport } = require('../utils/pdfGenerator');
const Interview = require('../Interview');
const { createChatCompletion } = require('../utils/openaiClient');
const { cleanMarkdown } = require('../utils/cleanMarkdown');

exports.generateAnalysis = async (req, res) => {
  try {
    const { feedback, interviewId } = req.body;

    const systemContext =
      "Assume the role of an experienced interviewer with 20+ years of experience. Provide a detailed markdown interview analysis report.";

    const prompt = `
    Using the candidate's performance data and the following feedback:
    "${feedback}"

    Please provide a **Detailed Interview Analysis Report** in markdown with the following sections:
    1. Areas Tested and Scores: List each technical area (e.g., Data Structures, Algorithms, System Design, etc.) with an individual score out of 10.
    2. Overall Score: Provide an overall score out of 10.
    3. Strength Topics
    4. Weakness Topics
    5. Areas for Improvement
    6. Interviewer Comments
    7. Additional Comments
    8. Technical Topic-wise Score Data as JSON
    `;

    // Get AI response
    const content = await createChatCompletion(systemContext, prompt);
    console.log("Response from AI:", content);

    if (!content) {
      console.error("OpenAI response missing content.");
      return res.status(500).json({ error: "OpenAI response invalid or empty." });
    }

    const markdown = cleanMarkdown(content);
    console.log("Cleaned Markdown:", markdown);

    // Extract overall score
    const scoreMatch = markdown.match(/Overall Score: (\d+(?:\.\d+)?)/i);
    if (!scoreMatch) {
      console.error("Overall Score not found in markdown.");
      return res.status(500).json({ error: "Could not extract score from analysis." });
    }
    const overallScore = scoreMatch[1];
    console.log("Extracted Score:", overallScore);

    // Generate the PDF
    const pdfPath = await generatePDFReport(markdown, overallScore);


    // Upload PDF to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      resource_type: "auto", // Automatically detect file type (pdf in this case)
      public_id: `interviews/interview-report-${Date.now()}`, // Optional public ID for the file
    });


    // Get Cloudinary URL
    const cloudinaryUrl = uploadResult.secure_url;
    console.log("Uploaded PDF URL:", cloudinaryUrl);

    // Delete the local PDF file after upload
    fs.unlinkSync(pdfPath);

    // Update Interview document with PDF URL and score
    const updatedInterview = await Interview.findByIdAndUpdate(
      interviewId,
      { pdfReport: cloudinaryUrl, score: overallScore },
      { new: true }
    );

    if (!updatedInterview) {
      return res.status(404).json({ error: "Interview not found." });
    }

    // Return the Cloudinary URL and interview ID
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

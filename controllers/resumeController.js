const { createChatCompletion } = require('../utils/openaiClient'); // Use your existing OpenAI client
const cloudinary = require('../lib/cloudinary');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const { cleanMarkdown } = require('../utils/cleanMarkdown');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: "No resume file uploaded." });
    }

    const resumeFile = req.files.resume;

    if (resumeFile.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: "Only PDF files are allowed." });
    }

    const tempFilePath = path.join(__dirname, '..', 'uploads', `${Date.now()}-${resumeFile.name}`);

    resumeFile.mv(tempFilePath, async (err) => {
      if (err) {
        console.error("Error moving file:", err);
        return res.status(500).json({ message: "Error moving the uploaded resume." });
      }

      console.log("Resume file saved temporarily at:", tempFilePath);

      try {
        const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
          resource_type: 'raw', 
          public_id: `resumes/${req.user.id}-${Date.now()}`,
        });

        if (uploadResult && uploadResult.secure_url) {
          const user = await User.findById(req.user.id);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }

          user.resumeUrl = uploadResult.secure_url;
          await user.save();

          fs.unlink(tempFilePath, (err) => {
            if (err) {
              console.error("Error deleting temporary file:", err);
            } else {
              console.log("Temporary file deleted:", tempFilePath);
            }
          });

          res.status(200).json({
            message: "Resume uploaded successfully",
            resumeUrl: uploadResult.secure_url,  
          });
        } else {
          return res.status(500).json({ message: "Error uploading resume to Cloudinary" });
        }

      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error("Error deleting temporary file after Cloudinary error:", err);
          } else {
            console.log("Temporary file deleted after Cloudinary error:", tempFilePath);
          }
        });

        res.status(500).json({ message: "Error uploading resume to Cloudinary." });
      }
    });

  } catch (error) {
    console.error("Error uploading resume:", error);
    res.status(500).json({ message: "Error uploading resume." });
  }
};
exports.calculateATS = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({ error: 'Resume URL is required.' });
    }

    const systemPrompt = "Assume the role of an ATS system. Evaluate the resume below and calculate the ATS score out of 100. Give only Numeric value i.e the Overall ATS Score.";
    const userPrompt = `Resume content: ${resumeUrl}`;

    // Get ATS score using OpenAI API
    const atsScore = await createChatCompletion(systemPrompt, userPrompt);
    const atsScoreNumber = parseInt(atsScore, 10);
    console.log(atsScore);

    res.status(200).json({
      message: 'ATS score calculated successfully.',
      atsScore: atsScore,
    });
  } catch (error) {
    console.error('Error calculating ATS:', error);
    res.status(500).json({ message: 'Failed to calculate ATS score.' });
  }
};

exports.getOverallComments = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({ error: 'Resume URL is required.' });
    }

    const systemPrompt = "Assume the role of a recruiter. Provide overall comments on the resume below, such as its content quality, formatting, and technical relevance.";
    const userPrompt = `Resume content: ${resumeUrl}`;

    const feedback = await createChatCompletion(systemPrompt, userPrompt);
    console.log(feedback);
    const cleanedFeedback = cleanMarkdown(feedback);
    res.status(200).json({
      message: 'Resume feedback generated successfully.',
      feedback: cleanedFeedback,
    });
  } catch (error) {
    console.error('Error generating feedback:', error);
    res.status(500).json({ message: 'Failed to generate resume feedback.' });
  }
};

// Function to provide tips to improve the resume in technical fields
exports.getImprovementTips = async (req, res) => {
  try {
    const { resumeUrl } = req.body;

    if (!resumeUrl) {
      return res.status(400).json({ error: 'Resume URL is required.' });
    }

    const systemPrompt = "Assume the role of a technical recruiter. Provide tips to improve the resume for the technical job market.";
    const userPrompt = `Resume content: ${resumeUrl}`;

    const improvementTips = await createChatCompletion(systemPrompt, userPrompt);
    console.log(improvementTips);
    const cleanedTips = cleanMarkdown(improvementTips);
    res.status(200).json({
      message: 'Resume improvement tips generated successfully.',
      improvementTips: cleanedTips,
    });
  } catch (error) {
    console.error('Error generating improvement tips:', error);
    res.status(500).json({ message: 'Failed to generate resume improvement tips.' });
  }
};
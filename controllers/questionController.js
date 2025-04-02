const openai = require("../utils/openaiClient");

exports.generateQuestion = async (req, res) => {
  try {
    const { jobRole, targetCompany, yearsOfExperience, isCoding, preferredLanguage } = req.body;

    const systemContext = `
        You are an experienced interviewer with 20+ years in technical interviews for the job role of ${jobRole} at companies like ${targetCompany}.
        Please provide a relevant interview question for this role, based on current trends and typical interview questions for ${jobRole} at ${targetCompany}. 
        If the role is technical (e.g., Software Engineer, Data Scientist), provide a coding or problem-solving question in ${preferredLanguage}. Otherwise, provide a theoretical question as per the questions asked for ${jobRole} role Interview.
      `;
  
      let prompt = "";
      if (isCoding) {
        prompt = `Generate a medium-level technical question for a ${jobRole} position at ${targetCompany}, considering ${yearsOfExperience} years of experience and ${preferredLanguage} as the main programming language.`;
      } else {
        prompt = `Generate a theoretical question for a ${jobRole} position at ${targetCompany} with ${yearsOfExperience} years of experience.`;
      }
    const question = await openai.createChatCompletion(systemContext, prompt);
    res.status(200).json({ question });
  } catch (error) {
    console.error("Error generating question:", error);
    res.status(500).json({ error: "Failed to generate question." });
  }
};
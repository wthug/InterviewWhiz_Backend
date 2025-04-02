const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_API_URL;

exports.createChatCompletion = async (systemPrompt, userPrompt) => {
  const body = {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000,
  };

  const headers = {
    "Content-Type": "application/json",
    "api-key": OPENAI_API_KEY,
  };

  const response = await axios.post(OPENAI_API_URL, body, { headers });
  return response.data.choices[0].message.content;
};
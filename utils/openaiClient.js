const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = process.env.OPENAI_API_URL;

exports.createChatCompletion = async (systemPrompt, userPrompt) => {
  const body = {
    model: "gpt-4-2",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.7,
    max_tokens: 4000,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  const response = await axios.post(OPENAI_API_URL, body, { headers });
  return response.data.choices[0].message.content;
};

exports.createChatCompletionWithHistory = async (messages) => {
  const body = {
    model: "gpt-4",
    messages, 
    temperature: 0.7,
    max_tokens: 4000,
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };

  const response = await axios.post(process.env.OPENAI_API_URL, body, {
    headers,
  });

  return response.data.choices[0].message.content;
};
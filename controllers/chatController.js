const { createChatCompletion } = require("../utils/openaiClient");

exports.generateChatResponse = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages must be a valid array." });
    }

    const systemMessage = messages.find(
      (msg) => msg.role === "system" || msg.role === "developer"
    );

    const userMessages = messages.filter((msg) => msg.role === "user");
    const userMessage = userMessages[userMessages.length - 1];

    if (!systemMessage || !userMessage) {
      return res
        .status(400)
        .json({ error: "Both system and user messages are required." });
    }

    const reply = await createChatCompletion(
      systemMessage.content,
      userMessage.content
    );

    return res.json({ reply });
  } catch (error) {
    console.error("OpenAI Chat Error:", error?.response?.data || error.message);
    return res
      .status(500)
      .json({ error: "Failed to generate chat response." });
  }
};
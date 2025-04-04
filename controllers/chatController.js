const { createChatCompletionWithHistory } = require("../utils/openaiClient");

exports.generateChatResponse = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "'messages' must be a valid array." });
    }

    const hasSystem = messages.some((msg) => msg.role === "system" || msg.role === "assistant");
    const hasUser = messages.some((msg) => msg.role === "user");

    if (!hasSystem || !hasUser) {
      return res.status(400).json({ error: "Both system and user messages are required." });
    }

    const reply = await createChatCompletionWithHistory(messages);


    return res.json({ reply });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate chat response." });
  }
};
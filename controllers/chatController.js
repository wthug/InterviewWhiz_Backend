const openai = require("../utils/openaiClient");

exports.generateChatResponse = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages must be a valid array." });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });

    return res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    res.status(500).json({ error: "Failed to generate chat response." });
  }
};

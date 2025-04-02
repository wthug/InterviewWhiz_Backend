exports.cleanMarkdown = (text) => {
    return text
      .replace(/#+\s*/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/```.*?\n([\s\S]*?)```/g, "$1")
      .replace(/[*_]{1,2}/g, "")
      .trim();
  };
  
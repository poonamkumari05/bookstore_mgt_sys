const chatWithGemini = async (message) => {
  try {
    const prompt = `
You are a friendly bookstore chatbot.

Rules:
- Answer greetings naturally
- Recommend books when asked
- Keep answers short
- Be friendly
- Maximum 5 lines
- Use simple English

User Message:
${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE 👉", data);

    if (data?.error) {
      return "AI is temporarily unavailable 🙂";
    }

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't understand that 🙂"
    );
  } catch (error) {
    console.error("GEMINI ERROR 👉", error);

    return "AI service unavailable";
  }
};

module.exports = { chatWithGemini };
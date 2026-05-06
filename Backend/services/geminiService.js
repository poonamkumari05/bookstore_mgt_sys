const chatWithGemini = async (message) => {
  try {
    if (!message || message.trim() === "") {
      return "Ask me about books 😊";
    }

    // 🧠 Clean + optimized prompt (important for quota saving)
    const prompt = `
You are a bookstore assistant chatbot.

Rules:
- Recommend books related to user query
- Keep response short (max 5 books)
- Use simple language
- Do not give long explanations
- Focus only on books and reading suggestions

User: ${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // 🚨 HANDLE QUOTA ERROR (IMPORTANT FIX)
    if (data?.error?.code === 429) {
      return "AI limit reached. Showing database results instead 🙂";
    }

    // 🧪 Debug log (optional, remove in production later)
    console.log("GEMINI RAW RESPONSE 👉", JSON.stringify(data, null, 2));

    // ✅ Safe response extraction
    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI"
    );

  } catch (error) {
    console.error("GEMINI ERROR 👉", error);
    return "AI is currently unavailable.";
  }
};

module.exports = { chatWithGemini };
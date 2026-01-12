const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeQuery = async (query) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      You are an AI brain for an all-in-one service platform.
      Analyze the following user query and return a JSON object with:
      - intent: (string) e.g., 'book_service', 'search_service', 'get_info'
      - category: (string) e.g., 'Carpenter', 'Plumber', 'Taxi', 'Food', 'Cleaning'
      - entities: (object) e.g., { location: 'airport', time: 'now', budget: 'low' }
      - suggestedResponse: (string) A helpful response to the user.

      User Query: "${query}"

      Return ONLY the JSON object.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean text in case of markdown formatting
        const jsonStr = text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        // Fallback if AI fails
        return {
            intent: 'search_service',
            category: 'General',
            entities: {},
            suggestedResponse: "I'm having trouble understanding. Could you please specify the service you need?"
        };
    }
};

module.exports = { analyzeQuery };

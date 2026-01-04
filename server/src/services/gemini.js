const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    console.error('CRITICAL: GEMINI_API_KEY environment variable is not set!');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'PLACEHOLDER_KEY');

// Use a lightweight model for embeddings
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
// Use a capable model for chat
const chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function getEmbedding(text) {
    try {
        const result = await embeddingModel.embedContent(text);
        return result.embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}

async function generateResponse(history, context, userMessage) {
    try {
        // Construct prompt with context
        const systemInstruction = `You are a helpful assistant.
    
    1. **Context & Accuracy**: Use the provided context to answer the user's question. If the answer is not in the context, and it's a specific factual question, say you don't know. However, if the user asks about your identity or gives a greeting, answer politely even if not in context.
    
    2. **Typo Handling**: The user might make spelling mistakes (e.g. "youdelf" instead of "yourself"). Please infer their intent and answer the intended question.
    
    3. **Formatting**: 
       - Do NOT use markdown bolding (e.g. **text**) or italics (*text*). 
       - Do NOT use complex markdown syntax.
       - Use simple dashes (-) or numbers (1.) for lists.
       - Keep the output clean and easy to read as plain text.

    Context:
    ${context}
    `;

        const chat = chatModel.startChat({
            history: history.map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }]
            })),
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            }
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating response:", error);
        return "I'm having trouble connecting to my brain right now. Please try again.";
    }
}

async function generatePromptStarters(content) {
    try {
        const prompt = `Based on the following content, generate exactly 5 short, relevant questions that users might want to ask. 
        
Content:
${content}

Return ONLY the questions, one per line, without numbering or bullet points. Keep each question under 50 characters.`;

        const result = await chatModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Split by newlines and filter empty lines
        const starters = text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && line.length < 100)
            .slice(0, 5);

        return starters.length > 0 ? starters : [
            "What can you tell me about this?",
            "What are the main features?",
            "How does this work?",
            "Tell me more"
        ];
    } catch (error) {
        console.error("Error generating prompt starters:", error);
        return [
            "What can you tell me about this?",
            "What are the main features?",
            "How does this work?",
            "Tell me more"
        ];
    }
}

module.exports = { getEmbedding, generateResponse, generatePromptStarters };

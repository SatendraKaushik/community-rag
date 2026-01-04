const express = require('express');
const router = express.Router();
const { Bot, Client, Document } = require('../models/schema');
const { getEmbedding, generateResponse, generatePromptStarters } = require('../services/gemini');
const { v4: uuidv4 } = require('uuid');

// Demo Limits
const MAX_MESSAGES_DEFAULT = 20;
const MAX_MESSAGES_CUSTOM = 10;

// Helper: Cosine Similarity for local vector search
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Init Session
router.post('/init', async (req, res) => {
    let { sessionId } = req.body;
    if (!sessionId) sessionId = uuidv4();

    // Find or create client
    let client = await Client.findOne({ sessionId });
    if (!client) {
        client = await Client.create({ sessionId, ip: req.ip });
    }


    // Ensure Default Bot exists
    let defaultBot = await Bot.findOne({ type: 'default' });
    if (!defaultBot) {
        defaultBot = await Bot.create({
            name: 'Veda',
            type: 'default',
            promptStarters: [
                "What services do you offer?",
                "Tell me about your AI capabilities",
                "Why should I choose your agency?",
                "Do you do custom web design?",
                "What's your pricing model?"
            ]
        });
    } else if (!defaultBot.promptStarters || defaultBot.promptStarters.length === 0) {
        // Update existing bot with prompt starters
        defaultBot.promptStarters = [
            "What services do you offer?",
            "Tell me about your AI capabilities",
            "Why should I choose your agency?",
            "Do you do custom web design?",
            "What's your pricing model?"
        ];
        await defaultBot.save();
    }


    // SEEDING: Check if default bot has content, if not, add "Elite Freelance Community" info
    const docCount = await Document.countDocuments({ botId: defaultBot._id });
    if (docCount === 0) {
        const seedContent = `
            Welcome to the Elite Freelance Community.
            
            Who We Are:
            We are a collective of true top 1% talent, composed of ex-FAANG engineers, award-winning designers, and AI specialists.
            Unlike traditional agencies, we operate as a high-performance swarm—assembling the perfect team for each project instantly.

            Our Services:
            1. **AI & RAG Solutions**: We build intelligent chatbots (like this one!), vector search systems, and automated agents using tailored LLMs.
            2. **Full-Stack Engineering**: Next.js, React, Node.js, and Python. We prioritize speed, scalability, and "Wow" factor UIs.
            3. **Premium Design**: Our electric, "professional orange" aesthetic converts visitors into clients. We handle UI/UX, branding, and motion graphics.
            
            Why Choose Us?
            - **Speed**: We ship MVPs in days, not months.
            - **Quality**: Zero technical debt. Enterprise-grade code from day one.
            - **Communication**: You talk directly to the builders, not account managers.

            Pricing:
            We offer project-based pricing starting at $5k for MVPs, and retainer models for ongoing AI development.
            
            Contact:
            Ready to build? Email us at hello@elitefreelance.io or book a demo on our calendar.
        `;

        // Split and embed
        const chunks = seedContent.split('\n\n');
        for (const chunk of chunks) {
            if (chunk.trim().length > 10) {
                const embedding = await getEmbedding(chunk);
                await Document.create({
                    botId: defaultBot._id,
                    content: chunk.trim(),
                    embedding
                });
            }
        }
        console.log("Default Bot Seeded with Freelance Data");
    }

    res.json({
        sessionId,
        defaultBotId: defaultBot._id,
        defaultBotName: defaultBot.name,
        defaultBotPromptStarters: defaultBot.promptStarters,
        messageCount: client.messageCount
    });
});

// Create Custom Bot & Upload Content
router.post('/custom-bot', async (req, res) => {
    const { sessionId, name, content } = req.body;

    const client = await Client.findOne({ sessionId });
    if (!client) return res.status(401).json({ error: "Invalid Session" });

    // Generate prompt starters based on content
    const promptStarters = await generatePromptStarters(content);

    // Create Bot
    const bot = await Bot.create({
        name: name || 'Custom Assistant',
        type: 'custom',
        ownerSessionId: sessionId,
        promptStarters
    });

    // Chunk and Embed Content (Simple splitting by newlines or rudimentary chunking)
    const chunks = content.split(/\n\s*\n/).filter(c => c.length > 20).slice(0, 10); // Limit to 10 chunks for demo

    for (const chunk of chunks) {
        const embedding = await getEmbedding(chunk);
        await Document.create({
            botId: bot._id,
            content: chunk,
            embedding
        });
    }

    res.json({
        botId: bot._id,
        botName: bot.name,
        promptStarters: bot.promptStarters,
        message: "Bot created and trained!"
    });
});

// Chat
router.post('/chat', async (req, res) => {
    const { sessionId, botId, message, history } = req.body;

    // Check Client Limit
    const client = await Client.findOne({ sessionId });
    if (!client) return res.status(401).json({ error: "Invalid Session" });

    // Different limits for custom vs default? Simplified: Global session limit
    const limit = 20; // Global limit for combined usage
    if (client.messageCount >= limit) {
        return res.status(403).json({
            error: "Demo limit reached.",
            isLimitReached: true
        });
    }

    // Get Bot
    const bot = await Bot.findById(botId);
    if (!bot) return res.status(404).json({ error: "Bot not found" });

    // Vector Search (Local Logic)
    // 1. Get query embedding
    const queryEmbedding = await getEmbedding(message);

    // 2. Fetch all docs for this bot (Optimized: Atlas Search is better, but this is for local demo reliability)
    // Warning: fetches all docs for the bot into memory. Fine for small demo.
    const docs = await Document.find({ botId: bot._id });

    // 3. Rank
    const scoredDocs = docs.map(doc => ({
        content: doc.content,
        score: cosineSimilarity(queryEmbedding, doc.embedding)
    })).sort((a, b) => b.score - a.score).slice(0, 3);

    const context = scoredDocs.map(d => d.content).join("\n---\n");

    // Generate Response
    const responseText = await generateResponse(history || [], context, message);

    // Update Usage
    client.messageCount += 1;
    client.lastActive = new Date();
    await client.save();

    res.json({
        response: responseText,
        usage: client.messageCount,
        sources: scoredDocs.map(d => d.content)
    });
});

module.exports = router;

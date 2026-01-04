const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
    type: { type: String, enum: ['default', 'custom'], default: 'custom' },
    name: { type: String, required: true },
    ownerSessionId: { type: String }, // For custom bots, linked to a temporary client session
    promptStarters: { type: [String], default: [] }, // Suggested questions for users
    createdAt: { type: Date, default: Date.now }
});

const ClientSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    ip: String,
    messageCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    lastActive: Date
});

const DocumentSchema = new mongoose.Schema({
    botId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bot', required: true },
    content: { type: String, required: true },
    embedding: { type: [Number], required: true }, // Vector embedding
    metadata: { type: Object }
});

module.exports = {
    Bot: mongoose.model('Bot', BotSchema),
    Client: mongoose.model('Client', ClientSchema),
    Document: mongoose.model('Document', DocumentSchema)
};

const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    query: { type: String, required: true },
    aiResponse: { type: String, required: true },
    intent: String,
    entities: mongoose.Schema.Types.Mixed,
    matchedProviders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Provider' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatLog', chatLogSchema);

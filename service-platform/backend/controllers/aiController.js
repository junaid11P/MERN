const { analyzeQuery } = require('../services/aiService');
const Provider = require('../models/Provider');
const ChatLog = require('../models/ChatLog');

const handleUserQuery = async (req, res) => {
    const { userId, query } = req.body;

    try {
        const analysis = await analyzeQuery(query);

        // Find providers based on category
        let providers = [];
        if (analysis.category && analysis.category !== 'General') {
            providers = await Provider.find({
                category: { $regex: new RegExp(analysis.category, 'i') },
                availability: true
            }).limit(3);
        }

        // Save chat log
        const chatLog = new ChatLog({
            userId,
            query,
            aiResponse: analysis.suggestedResponse,
            intent: analysis.intent,
            category: analysis.category,
            entities: analysis.entities,
            matchedProviders: providers.map(p => p._id)
        });
        await chatLog.save();

        res.json({
            analysis,
            providers,
            chatLogId: chatLog._id
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { handleUserQuery };

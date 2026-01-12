const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'Carpenter', 'Plumber'
    subServices: [String],
    pricing: {
        baseRate: Number,
        unit: String // e.g., 'per hour', 'per task'
    },
    availability: { type: Boolean, default: true },
    status: { type: String, enum: ['online', 'busy', 'offline'], default: 'online' },
    rating: { type: Number, default: 5 },
    location: {
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    serviceRadius: { type: Number, default: 10 }, // in km
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', providerSchema);

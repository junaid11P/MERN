const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Machine', 'Vessel', 'Tank', 'Mixer']
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive', 'Under Maintenance']
    },
    lastCleanedDate: {
        type: Date
    }
}, {
    timestamps: true
});

// Transform _id to id for frontend compatibility
equipmentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Equipment', equipmentSchema);

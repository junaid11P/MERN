const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
    serviceType: String,
    details: String,
    status: {
        type: String,
        enum: ['pending', 'accepted', 'arriving', 'in-progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    price: Number,
    scheduledAt: Date,
    completedAt: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);

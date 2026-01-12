const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    const { userId, providerId, serviceType, details, price } = req.body;

    try {
        const booking = new Booking({
            userId,
            providerId,
            serviceType,
            details,
            price,
            status: 'pending'
        });

        await booking.save();

        // Emit socket event to provider if they are online
        if (req.io) {
            req.io.to(providerId.toString()).emit('new_booking', booking);
        }

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateBookingStatus = async (req, res) => {
    const { bookingId, status } = req.body;

    try {
        const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });

        // Notify user
        if (req.io) {
            req.io.to(booking.userId.toString()).emit('booking_update', booking);
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createBooking, updateBookingStatus };

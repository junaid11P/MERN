const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

const getDashboardStats = async (req, res) => {
    try {
        const totalProviders = await Provider.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const completedBookings = await Booking.find({ status: 'completed' });
        const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.price || 0), 0);

        // Mock chart data for revenue reporting
        const revenueData = [
            { name: 'Mon', revenue: 4000 },
            { name: 'Tue', revenue: 3000 },
            { name: 'Wed', revenue: 2000 },
            { name: 'Thu', revenue: 2780 },
            { name: 'Fri', revenue: 1890 },
            { name: 'Sat', revenue: 2390 },
            { name: 'Sun', revenue: 3490 },
        ];

        res.json({
            totalProviders,
            totalBookings,
            totalRevenue,
            revenueData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProviders = async (req, res) => {
    try {
        const providers = await Provider.find();
        res.json(providers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getDashboardStats, getProviders };

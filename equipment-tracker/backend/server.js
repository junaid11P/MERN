require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const equipmentRoutes = require('./routes/equipment');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/equipment', equipmentRoutes);

// Root Route
app.get('/', (req, res) => {
    res.send('Equipment Tracker API (MongoDB) is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

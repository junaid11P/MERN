// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Allow frontend to access backend
const mongoose = require('mongoose');
const equipmentRoutes = require('./routes/equipment');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to handle requests
app.use(cors()); // Fixes CORS errors
app.use(express.json()); // Parses incoming JSON data

// Connect to MongoDB
// ensure you have your .env file set up!
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
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

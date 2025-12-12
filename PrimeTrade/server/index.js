const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables early
dotenv.config();

const app = express();

// Use PORT 5001 to avoid conflict with macOS AirPlay (runs on 5000)
const PORT = process.env.PORT || 5001;

// CORS Configuration:
// We need to explicitly allow the frontend origin and specific headers
// like 'x-auth-token' to ensure secure communication between client and server.
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "x-auth-token", "Authorization"],
    credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Database Connection
// Connect to local MongoDB instance. Ensure mongod is running.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/primetrade_mern')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
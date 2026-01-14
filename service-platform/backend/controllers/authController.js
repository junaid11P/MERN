const User = require('../models/User');
const Provider = require('../models/Provider');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// User Auth
const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id, 'user'),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Simple hardcoded admin check for this demo, or check role in DB
        if (email === 'admin@platform.com' && password === 'admin123') {
            return res.json({
                _id: 'admin_root',
                name: 'System Admin',
                email: 'admin@platform.com',
                role: 'admin',
                token: generateToken('admin_root', 'admin'),
            });
        }

        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: 'user',
                token: generateToken(user._id, 'user'),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Provider Auth
const registerProvider = async (req, res) => {
    const { name, email, password, phone, category } = req.body;
    try {
        const providerExists = await Provider.findOne({ email });
        if (providerExists) return res.status(400).json({ message: 'Provider already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const provider = await Provider.create({
            name,
            email,
            password: hashedPassword,
            phone,
            category
        });

        res.status(201).json({
            _id: provider._id,
            name: provider.name,
            email: provider.email,
            token: generateToken(provider._id, 'provider'),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginProvider = async (req, res) => {
    const { email, password } = req.body;
    try {
        const provider = await Provider.findOne({ email });
        if (provider && (await bcrypt.compare(password, provider.password))) {
            res.json({
                _id: provider._id,
                name: provider.name,
                email: provider.email,
                token: generateToken(provider._id, 'provider'),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    registerProvider,
    loginProvider
};

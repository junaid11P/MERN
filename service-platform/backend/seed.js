const mongoose = require('mongoose');
const Provider = require('./models/Provider');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Provider.deleteMany({});
        await User.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 10);

        // Create a mock user
        const user = await User.create({
            name: 'Test User',
            email: 'user@example.com',
            password: hashedPassword,
            phone: '9876543210',
            location: {
                address: 'HSR Layout, Bangalore',
                coordinates: { lat: 12.9141, lng: 77.6412 }
            }
        });

        // Create mock providers
        const providers = [
            {
                name: 'Kumar Carpenters',
                email: 'kumar@example.com',
                password: hashedPassword,
                phone: '1111111111',
                category: 'Carpenter',
                subServices: ['Door repair', 'Furniture assembly'],
                pricing: { baseRate: 450, unit: 'per visit' },
                rating: 4.8,
                location: { address: 'Koramangala, Bangalore', coordinates: { lat: 12.9352, lng: 77.6245 } }
            },
            {
                name: 'Elite Plumbing',
                email: 'elite@example.com',
                password: hashedPassword,
                phone: '2222222222',
                category: 'Plumber',
                subServices: ['Leak repair', 'Pipe installation'],
                pricing: { baseRate: 300, unit: 'per hour' },
                rating: 4.5,
                location: { address: 'Indiranagar, Bangalore', coordinates: { lat: 12.9716, lng: 77.6412 } }
            },
            {
                name: 'Super Cleaning',
                email: 'clean@example.com',
                password: hashedPassword,
                phone: '3333333333',
                category: 'Cleaning',
                subServices: ['Deep cleaning', 'Sofa cleaning'],
                pricing: { baseRate: 800, unit: 'per task' },
                rating: 4.9,
                location: { address: 'MG Road, Bangalore', coordinates: { lat: 12.9719, lng: 77.5937 } }
            },
            {
                name: 'Fast Cab Services',
                email: 'tax@example.com',
                password: hashedPassword,
                phone: '4444444444',
                category: 'Taxi',
                subServices: ['Airport drop', 'Local travel'],
                pricing: { baseRate: 500, unit: 'per trip' },
                rating: 4.2,
                location: { address: 'Bangalore Airport', coordinates: { lat: 13.1986, lng: 77.7066 } }
            }
        ];

        await Provider.create(providers);
        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();

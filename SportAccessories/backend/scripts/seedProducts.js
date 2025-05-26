const mongoose = require('mongoose');
const Product = require('../models/Products');

const products = [
  {
    name: "Professional Basketball",
    description: "High-quality professional basketball with superior grip and durability",
    price: 29.99,
    imageUrl: "/images/basketball.jpg",
    category: "Basketball",
    stock: 50
  },
  {
    name: "Soccer Ball",
    description: "Professional grade soccer ball suitable for all playing conditions",
    price: 24.99,
    imageUrl: "/images/soccer.jpg",
    category: "Football",
    stock: 45
  },
  {
    name: "Tennis Racket",
    description: "Professional tennis racket with perfect balance and control",
    price: 89.99,
    imageUrl: "/images/tennis-racket.jpg",
    category: "Tennis",
    stock: 30
  },
  {
    name: "Yoga Mat",
    description: "Premium non-slip yoga mat with perfect cushioning",
    price: 19.99,
    imageUrl: "/images/yoga-mat.jpg",
    category: "Yoga",
    stock: 60
  },
  {
    name: "Dumbbells Set",
    description: "Adjustable dumbbells set perfect for home workouts",
    price: 49.99,
    imageUrl: "/images/dumbbells.jpg",
    category: "Fitness",
    stock: 25
  },
  {
    name: "Running Shoes",
    description: "Comfortable and durable running shoes with great support",
    price: 79.99,
    imageUrl: "/images/running-shoes.jpg",
    category: "Running",
    stock: 40
  }
];

mongoose.connect('mongodb://localhost:27017/Sports')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert new products
    const result = await Product.insertMany(products);
    console.log('Added sample products:', result.length);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

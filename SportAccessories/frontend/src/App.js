// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ReturnPolicy from './pages/ReturnPolicy';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Order from './pages/Order';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return false;
      }

      await axios.post('http://localhost:5050/api/cart/add', {
        productId: product._id,
        quantity: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Show success notification
      alert('Product added to cart successfully!');
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart');
      return false;
    }
  };

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar onSearch={setSearchQuery} isAuthenticated={isAuthenticated} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route 
              path="/products" 
              element={<Products searchQuery={searchQuery} addToCart={addToCart} />}
            />
            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/order/:orderId" 
              element={
                <ProtectedRoute>
                  <Order />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Register setIsAuthenticated={setIsAuthenticated} />
                )
              }
            />
            <Route path="/return-policy" element={<ReturnPolicy />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

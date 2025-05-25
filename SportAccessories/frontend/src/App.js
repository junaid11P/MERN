// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import ReturnPolicy from './pages/ReturnPolicy';
import Checkout from './pages/Checkout';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
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
              element={
                <Products 
                  addToCart={addToCart} 
                  searchQuery={searchQuery}
                />
              } 
            />
            <Route path="/cart" element={
              <Cart 
                cartItems={cartItems}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/return-policy" element={<ReturnPolicy />} />
            <Route 
              path="/checkout" 
              element={
                isAuthenticated ? (
                  <Checkout cartItems={cartItems} />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

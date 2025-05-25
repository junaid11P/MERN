// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Home />
      
      {/* Define your routes here */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>About Us</h5>
            <p>Your trusted source for quality sports accessories.</p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light text-decoration-none">Home</a></li>
              <li><a href="/products" className="text-light text-decoration-none">Products</a></li>
              <li><a href="/contact" className="text-light text-decoration-none">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact Info</h5>
            <ul className="list-unstyled">
              <li>Email: info@sportaccessories.com</li>
              <li>Phone: (123) 456-7890</li>
            </ul>
          </div>
        </div>
        <hr className="bg-light" />
        <div className="text-center">
          <p className="mb-0">&copy; 2025 Sport Accessories. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
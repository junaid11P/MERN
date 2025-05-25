// src/components/Register.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Create Your Account</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input type="text" className="form-control" id="name" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="email" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" id="phone" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Shipping Address</label>
                  <textarea className="form-control" id="address" rows="2" required></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input type="password" className="form-control" id="password" required />
                </div>
                <button type="submit" className="btn btn-success w-100">Register</button>
              </form>

              <div className="text-center mt-3">
                <small>Already have an account? <Link to="/login">Login here</Link></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

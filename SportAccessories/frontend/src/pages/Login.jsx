// src/components/Login.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // make sure you're using react-router-dom

const Login = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">Login</h3>
              <form>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="loginEmail" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">Password</label>
                  <input type="password" className="form-control" id="loginPassword" required />
                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>
                <button type="submit" className="btn btn-primary w-100">Login</button>
              </form>

              <div className="text-center mt-3">
                <small>New customer? <Link to="/register">Register here</Link></small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

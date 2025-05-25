/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';


const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="Home.jsx" title="Home">
            {/* Logo on the left */}
            <img src="1.png" alt="Logo" width="70" height="70" className="d-inline-block align-text-top" />
          </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Product</a>
        </li>
      </ul>
    </div>

            {/* Centered search bar */}
            <div className="mx-auto" style={{ width: '50%' }}>
              <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>


            {/* Login Icon on the right */}
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/pages/Login.jsx" title="Login">
                  <i className="bi bi-person" style={{ fontSize: '1.5rem' }}></i><br />
    <small>Login </small>
                </a>
              </li>
            </ul>
            {/* Cart Icon on the right */}
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/pages/Cart.jsx" title="Cart">
                  <i className="bi bi-cart4" style={{ fontSize: '1.5rem' }}></i><br />
    <small>Cart</small>
                </a>
              </li>
            </ul>
          
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

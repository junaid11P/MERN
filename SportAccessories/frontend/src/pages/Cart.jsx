import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, updateQuantity, removeFromCart }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty</p>
          <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-2">
                  <img src={item.image} className="img-fluid rounded-start" alt={item.name} />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">Price: ${item.price}</p>
                    <div className="d-flex align-items-center">
                      <button 
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        className="btn btn-sm btn-secondary ms-2"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        +
                      </button>
                      <button 
                        className="btn btn-sm btn-danger ms-3"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="card mt-4">
            <div className="card-body">
              <h5>Order Summary</h5>
              <p>Total Items: {cartItems.length}</p>
              <p>Total Amount: ${calculateTotal().toFixed(2)}</p>
              <button className="btn btn-success">Proceed to Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
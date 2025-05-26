import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    shippingAddress: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:5050/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const total = formData.paymentMethod === 'cod' 
        ? cart.total * 1.01  // Add 1% COD charge
        : cart.total;

      const orderData = {
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        totalAmount: total
      };

      // Only include payment details for card payments
      if (formData.paymentMethod === 'card') {
        orderData.paymentDetails = {
          cardNumber: formData.cardNumber,
          cardExpiry: formData.cardExpiry,
          cardCVV: formData.cardCVV
        };
      } else {
        // For COD, include delivery charge details
        orderData.paymentDetails = {
          isCashOnDelivery: true,
          codCharge: (cart.total * 0.01).toFixed(2)
        };
      }

      await axios.post('http://localhost:5050/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Show success message and navigate to profile
      alert('Order placed successfully!');
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    }
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3" role="alert">{error}</div>;

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title mb-4">Checkout Details</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="shippingAddress" className="form-label">Shipping Address</label>
                  <textarea
                    className="form-control"
                    id="shippingAddress"
                    name="shippingAddress"
                    value={formData.shippingAddress}
                    onChange={handleChange}
                    rows="3"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="card"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="card">
                      Credit/Debit Card
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="cod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="cod">
                      Cash on Delivery
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="card-payment-details">
                    <div className="mb-3">
                      <label htmlFor="cardNumber" className="form-label">Card Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required={formData.paymentMethod === 'card'}
                        maxLength="16"
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="cardExpiry" className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardExpiry"
                          name="cardExpiry"
                          placeholder="MM/YY"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          required={formData.paymentMethod === 'card'}
                          maxLength="5"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label htmlFor="cardCVV" className="form-label">CVV</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cardCVV"
                          name="cardCVV"
                          value={formData.cardCVV}
                          onChange={handleChange}
                          required={formData.paymentMethod === 'card'}
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Order Summary</h4>
              {cart.items.map((item) => (
                <div key={item.product._id} className="d-flex justify-content-between mb-2">
                  <span>{item.product.name} × {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              {formData.paymentMethod === 'cod' && (
                <div className="d-flex justify-content-between mb-2">
                  <span>Cash on Delivery Charge (1%):</span>
                  <span>${(cart.total * 0.01).toFixed(2)}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>
                  ${formData.paymentMethod === 'cod' 
                    ? (cart.total * 1.01).toFixed(2) 
                    : cart.total.toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
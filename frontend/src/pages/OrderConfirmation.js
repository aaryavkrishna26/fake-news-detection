import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchOrder();
  }, [token, orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrder(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="confirmation-container"><p>Loading...</p></div>;
  }

  if (error || !order) {
    return (
      <div className="confirmation-container">
        <div className="error-state">
          <h2>❌ Error</h2>
          <p>{error || 'Order not found'}</p>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-header">
          <div className="checkmark">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order</p>
        </div>

        {/* Order Info */}
        <div className="order-info-section">
          <h2>Order Details</h2>
          
          <div className="info-grid">
            <div className="info-box">
              <label>Order Number</label>
              <p>{order.orderNumber}</p>
            </div>

            <div className="info-box">
              <label>Order Date</label>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            <div className="info-box">
              <label>Order Status</label>
              <p className={`status status-${order.status}`}>{order.status.toUpperCase()}</p>
            </div>

            <div className="info-box">
              <label>Payment Method</label>
              <p>{order.paymentMethod === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card'}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="items-section">
          <h2>Ordered Items</h2>
          <div className="items-list">
            {order.items.map((item, index) => (
              <div key={index} className="item-row">
                <div className="item-details">
                  <p className="item-name">{item.materialName}</p>
                  <p className="item-shop">Shop: {item.sellerName}</p>
                </div>
                <div className="item-quantity">
                  <span>{item.quantity} qty @ ₹{item.price}</span>
                </div>
                <div className="item-price">
                  <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="address-section">
          <h2>Delivery Address</h2>
          <div className="address-box">
            <p className="address-name"><strong>{order.deliveryAddress.name}</strong></p>
            <p>{order.deliveryAddress.address}</p>
            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
            <p>{order.deliveryAddress.phone}</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="price-section">
          <h2>Price Breakdown</h2>
          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>₹{order.totalPrice.toFixed(2)}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="price-row discount">
                <span>Discount ({order.couponCode})</span>
                <span>-₹{order.discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="price-row total">
              <span>Total Amount</span>
              <span className="total-amount">₹{order.finalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps">
          <h2>Next Steps</h2>
          <div className="steps">
            {order.paymentMethod === 'cash_on_delivery' && (
              <>
                <div className="step">
                  <div className="step-number">1</div>
                  <p>Your order will be delivered to the address above</p>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <p>Please have the payment amount ready on delivery</p>
                </div>
              </>
            )}
            {order.paymentMethod === 'card' && (
              <div className="step">
                <div className="step-number">1</div>
                <p>Your payment has been received successfully</p>
              </div>
            )}
            <div className="step">
              <div className="step-number">{order.paymentMethod === 'cash_on_delivery' ? '3' : '2'}</div>
              <p>You can track your order from your dashboard</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={() => navigate('/dashboard')} className="btn-dashboard">
            View in Dashboard
          </button>
          <button onClick={() => navigate('/browse')} className="btn-continue-shopping">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;

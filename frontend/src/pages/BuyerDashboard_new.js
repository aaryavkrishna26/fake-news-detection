import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const [activeTab, setActiveTab] = useState('cart');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!token || userRole !== 'buyer') {
      navigate('/login');
      return;
    }
    fetchOrders();
    fetchUserProfile();
  }, [token, userRole]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = (materialId) => {
    removeFromCart(materialId);
  };

  const handleUpdateQuantity = (materialId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(materialId);
    } else {
      updateQuantity(materialId, newQuantity);
    }
  };

  const handleProceedToBuy = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add items before checking out.');
      return;
    }
    navigate('/checkout');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#3b82f6';
      case 'delivered':
        return '#10b981';
      case 'shipped':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'confirmed':
        return 'badge-confirmed';
      case 'delivered':
        return 'badge-delivered';
      case 'shipped':
        return 'badge-shipped';
      default:
        return 'badge-pending';
    }
  };

  const cartTotal = getCartTotal();
  const gstAmount = (cartTotal * 0.18).toFixed(2);
  const finalTotal = (parseFloat(cartTotal) + parseFloat(gstAmount)).toFixed(2);

  return (
    <div className="buyer-dashboard">
      <div className="dashboard-header">
        <h1>👜 My Dashboard</h1>
        <p className="header-subtitle">Welcome back, {userProfile?.name || 'Buyer'}</p>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
          onClick={() => setActiveTab('cart')}
        >
          🛒 My Cart {cartItems.length > 0 && `(${cartItems.length})`}
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 My Orders {orders.length > 0 && `(${orders.length})`}
        </button>
      </div>

      <div className="dashboard-content">
        {/* TAB 1: MY CART */}
        {activeTab === 'cart' && (
          <div className="tab-pane">
            <h2>Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛍️</div>
                <p>Your cart is empty</p>
                <button
                  className="btn-browse"
                  onClick={() => navigate('/categories')}
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="cart-layout">
                {/* Cart Items */}
                <div className="cart-items-section">
                  {cartItems.map(item => (
                    <div key={item._id} className="cart-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="seller-info">Seller: {item.shopName}</p>
                        <p className="category-info">{item.category}</p>
                        <p className="unit-price">₹{item.price}/{item.unit}</p>
                      </div>

                      <div className="item-quantity">
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="qty-input"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item._id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button
                          className="qty-btn"
                          onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-total">
                        <p className="price">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>

                      <button
                        className="btn-remove-item"
                        onClick={() => handleRemoveFromCart(item._id)}
                        title="Remove from cart"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="cart-summary">
                  <h3>Order Summary</h3>
                  
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span>GST (18%)</span>
                    <span>₹{gstAmount}</span>
                  </div>

                  <div className="summary-row">
                    <span>Delivery</span>
                    <span className="delivery-free">FREE</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-total">
                    <span>Total Amount</span>
                    <span className="total-amount">₹{finalTotal}</span>
                  </div>

                  <button
                    className="btn-proceed"
                    onClick={handleProceedToBuy}
                  >
                    Proceed to Buy
                  </button>

                  <button
                    className="btn-continue-shopping"
                    onClick={() => navigate('/categories')}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="tab-pane">
            <h2>My Orders</h2>

            {loading ? (
              <div className="loading">Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-orders">
                <div className="empty-icon">📦</div>
                <p>No orders yet. Start shopping! 🛍️</p>
                <button
                  className="btn-browse"
                  onClick={() => navigate('/categories')}
                >
                  Browse Materials
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h4>Order #{order.orderNumber}</h4>
                        <p className="order-date">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>

                    <div className="order-items">
                      <p className="items-label">Items:</p>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <span>{item.materialName || 'Material'}</span>
                          <span>{item.quantity} × ₹{item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <span>Total:</span>
                        <span className="total">₹{order.finalPrice.toFixed(2)}</span>
                      </div>
                      <button
                        className="btn-view-details"
                        onClick={() => navigate(`/order-confirmation/${order._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
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
    <div className="dashboard-container">
      <div className="container">
        <h1 className="page-title">👜 My Dashboard</h1>
        {userProfile && <p style={{color: 'var(--gray-600)', fontSize: '14px', marginBottom: '16px'}}>Welcome back, {userProfile?.name || 'Buyer'}</p>}

        {/* Tab Navigation */}
        <div style={{display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--gray-200)', paddingBottom: '12px'}}>
          <button
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: activeTab === 'cart' ? 'var(--blue)' : 'transparent',
              color: activeTab === 'cart' ? 'white' : 'var(--gray-600)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'cart' ? '600' : '400'
            }}
            onClick={() => setActiveTab('cart')}
          >
            🛒 My Cart {cartItems.length > 0 && `(${cartItems.length})`}
          </button>
          <button
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: activeTab === 'orders' ? 'var(--blue)' : 'transparent',
              color: activeTab === 'orders' ? 'white' : 'var(--gray-600)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === 'orders' ? '600' : '400'
            }}
            onClick={() => setActiveTab('orders')}
          >
            📦 My Orders {orders.length > 0 && `(${orders.length})`}
          </button>
        </div>

        {/* TAB 1: MY CART */}
        {activeTab === 'cart' && (
          <div>
            <h2 style={{fontSize: '18px', marginBottom: '16px'}}>Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
              <div style={{textAlign: 'center', padding: '32px', backgroundColor: 'var(--gray-50)', borderRadius: '6px'}}>
                <div style={{fontSize: '48px', marginBottom: '12px'}}>🛍️</div>
                <p style={{color: 'var(--gray-600)', marginBottom: '16px'}}>Your cart is empty</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/select-location')}
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
                      <div className="cart-item-details">
                        <h3 className="cart-item-name">{item.name}</h3>
                        <p className="cart-item-seller">Seller: {item.shopName}</p>
                        <p style={{fontSize: '12px', color: 'var(--gray-600)', marginBottom: '4px'}}>{item.category}</p>
                        <p className="cart-item-price">₹{item.price}/{item.unit}</p>
                      </div>

                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}>−</button>
                        <input
                          type="number"
                          className="qty-input"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item._id, parseInt(e.target.value) || 1)}
                          min="1"
                        />
                        <button className="qty-btn" onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>+</button>
                      </div>

                      <div className="cart-item-subtotal">
                        <span className="subtotal-label">₹{(item.price * item.quantity).toFixed(2)}</span>
                        <button 
                          className="btn btn-outline"
                          style={{padding: '4px 8px', fontSize: '12px'}}
                          onClick={() => handleRemoveFromCart(item._id)}
                          title="Remove from cart"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="cart-summary" style={{height: 'fit-content', position: 'sticky', top: '16px'}}>
                  <h3 style={{fontSize: '16px', marginBottom: '12px'}}>Order Summary</h3>
                  
                  <div className="summary-row">
                    <span style={{fontSize: '13px'}}>Subtotal</span>
                    <span style={{fontSize: '13px', fontWeight: '500'}}>₹{cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="summary-row">
                    <span style={{fontSize: '13px'}}>GST (18%)</span>
                    <span style={{fontSize: '13px', fontWeight: '500'}}>₹{gstAmount}</span>
                  </div>

                  <div className="summary-row" style={{marginBottom: '12px'}}>
                    <span style={{fontSize: '13px'}}>Delivery</span>
                    <span style={{fontSize: '13px', fontWeight: '600', color: 'var(--green)'}}>FREE</span>
                  </div>

                  <div style={{borderTop: '2px solid var(--gray-300)', paddingTop: '12px', marginBottom: '16px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <span style={{fontSize: '14px', fontWeight: '600'}}>Total</span>
                      <span style={{fontSize: '18px', fontWeight: '700', color: 'var(--blue)'}}>₹{finalTotal}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{width: '100%', marginBottom: '8px'}}
                    onClick={handleProceedToBuy}
                  >
                    Proceed to Checkout
                  </button>

                  <button
                    className="btn btn-outline"
                    style={{width: '100%'}}
                    onClick={() => navigate('/select-location')}
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
          <div>
            <h2 style={{fontSize: '18px', marginBottom: '16px'}}>My Orders</h2>

            {loading ? (
              <p style={{color: 'var(--gray-600)', textAlign: 'center', padding: '24px'}}>Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div style={{textAlign: 'center', padding: '32px', backgroundColor: 'var(--gray-50)', borderRadius: '6px'}}>
                <div style={{fontSize: '48px', marginBottom: '12px'}}>📦</div>
                <p style={{color: 'var(--gray-600)', marginBottom: '16px'}}>No orders yet. Start shopping! 🛍️</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/select-location')}
                >
                  Browse Materials
                </button>
              </div>
            ) : (
              <div style={{display: 'grid', gap: '12px'}}>
                {orders.map((order) => (
                  <div key={order._id} style={{backgroundColor: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', padding: '12px', overflow: 'hidden'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--gray-100)'}}>
                      <div>
                        <h4 style={{fontSize: '14px', fontWeight: '600', marginBottom: '4px'}}>Order #{order.orderNumber}</h4>
                        <p style={{fontSize: '12px', color: 'var(--gray-600)'}}>
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <span className={`badge badge-${(order.status || 'pending').toLowerCase()}`} style={{fontSize: '12px'}}>
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                      </span>
                    </div>

                    <div style={{marginBottom: '12px'}}>
                      <p style={{fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--gray-700)'}}>Items ({order.items?.length || 0}):</p>
                      <div style={{backgroundColor: 'var(--gray-50)', borderRadius: '4px', padding: '8px', maxHeight: '100px', overflowY: 'auto'}}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={{fontSize: '12px', color: 'var(--gray-600)', paddingBottom: '4px', marginBottom: idx < (order.items?.length || 0) - 1 ? '4px' : '0', borderBottom: idx < (order.items?.length || 0) - 1 ? '1px solid var(--gray-200)' : 'none'}}>
                            <span>{item.materialName || 'Material'}</span>
                            <span style={{float: 'right'}}>{item.quantity} × ₹{item.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <span style={{fontSize: '12px', color: 'var(--gray-600)'}}>Total: </span>
                        <span style={{fontSize: '14px', fontWeight: '600', color: 'var(--blue)'}}>₹{(order.finalPrice || order.totalAmount || 0).toFixed(2)}</span>
                      </div>
                      <button
                        className="btn btn-outline"
                        style={{fontSize: '12px', padding: '6px 12px'}}
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

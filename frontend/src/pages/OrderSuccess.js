import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOrder(response.data.order || response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  if (loading) {
    return (
      <div className="order-success-container">
        <div className="container">
          <p style={{textAlign: 'center', color: 'var(--gray-600)'}}>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-success-container">
        <div className="container">
          <p style={{textAlign: 'center', color: 'var(--red)'}}>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-success-container">
        <div className="container">
          <p style={{textAlign: 'center', color: 'var(--red)'}}>Order not found</p>
        </div>
      </div>
    );
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);

  return (
    <div className="order-success-container">
      <div className="container">
        <div style={{maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          {/* Success Checkmark */}
          <div style={{textAlign: 'center', marginBottom: '20px'}}>
            <div style={{fontSize: '64px', marginBottom: '12px'}}>✓</div>
            <h1 style={{fontSize: '24px', fontWeight: '700', color: 'var(--green)', marginBottom: '8px'}}>Order Placed Successfully! 🎉</h1>
            <p style={{color: 'var(--gray-600)', fontSize: '14px'}}>Thank you for your order. We're preparing your materials for shipment.</p>
          </div>

          {/* Order Details Card */}
          <div style={{backgroundColor: 'var(--gray-50)', borderRadius: '6px', padding: '16px', marginBottom: '16px'}}>
            <div className="summary-row" style={{marginBottom: '8px'}}>
              <span style={{fontSize: '13px', color: 'var(--gray-600)'}}>Order ID:</span>
              <span style={{fontSize: '13px', fontWeight: '600'}}>{order._id || order.orderId || 'N/A'}</span>
            </div>

            <div className="summary-row" style={{marginBottom: '8px'}}>
              <span style={{fontSize: '13px', color: 'var(--gray-600)'}}>Order Date:</span>
              <span style={{fontSize: '13px', fontWeight: '500'}}>
                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>

            <div className="summary-row" style={{marginBottom: '8px'}}>
              <span style={{fontSize: '13px', color: 'var(--gray-600)'}}>Estimated Delivery:</span>
              <span style={{fontSize: '13px', fontWeight: '500'}}>
                {deliveryDate.toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} (3-5 days)
              </span>
            </div>

            <div className="summary-row" style={{marginBottom: '8px'}}>
              <span style={{fontSize: '13px', color: 'var(--gray-600)'}}>Payment:</span>
              <span style={{fontSize: '13px', fontWeight: '500'}}>
                {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                {order.paymentMethod === 'card' && 'Debit Card'}
                {order.paymentMethod === 'upi' && 'UPI'}
              </span>
            </div>

            <div className="summary-row">
              <span style={{fontSize: '13px', color: 'var(--gray-600)'}}>Status:</span>
              <span className={`badge badge-${(order.orderStatus || 'pending').toLowerCase()}`} style={{fontSize: '12px'}}>
                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Pending'}
              </span>
            </div>
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <h3 style={{fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>Items Ordered</h3>
              <div style={{backgroundColor: '#f5f5f5', borderRadius: '6px', padding: '8px'}}>
                {order.items.map((item, index) => (
                  <div key={index} style={{paddingBottom: '8px', marginBottom: '8px', borderBottom: index < order.items.length - 1 ? '1px solid var(--gray-200)' : 'none'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div>
                        <p style={{fontSize: '13px', fontWeight: '500'}}>{item.name || item.materialName || 'Material'}</p>
                        <p style={{fontSize: '12px', color: 'var(--gray-600)'}}>
                          {item.category && <span>{item.category}</span>}
                          {item.unit && <span> • {item.quantity} {item.unit}</span>}
                        </p>
                      </div>
                      <p style={{fontSize: '13px', fontWeight: '600', color: 'var(--blue)'}}>₹{item.totalPrice || (item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Amount */}
          <div style={{backgroundColor: 'var(--gray-50)', borderRadius: '6px', padding: '12px', marginBottom: '16px'}}>
            <div className="summary-row" style={{marginBottom: '6px'}}>
              <span style={{fontSize: '13px'}}>Subtotal:</span>
              <span style={{fontSize: '13px', fontWeight: '500'}}>₹{(order.subtotal || (order.totalAmount / 1.18)).toFixed(2)}</span>
            </div>
            <div className="summary-row" style={{marginBottom: '6px'}}>
              <span style={{fontSize: '13px'}}>GST (18%):</span>
              <span style={{fontSize: '13px', fontWeight: '500'}}>₹{(order.gstAmount || (order.totalAmount * 0.18 / 1.18)).toFixed(2)}</span>
            </div>
            <div className="summary-row" style={{marginBottom: '12px'}}>
              <span style={{fontSize: '13px'}}>Delivery:</span>
              <span style={{fontSize: '13px', fontWeight: '600', color: 'var(--green)'}}>FREE</span>
            </div>
            <div style={{borderTop: '1px solid var(--gray-300)', paddingTop: '8px'}}>
              <div className="summary-row">
                <span style={{fontSize: '14px', fontWeight: '600'}}>Total Amount:</span>
                <span style={{fontSize: '16px', fontWeight: '700', color: 'var(--blue)'}}>₹{(order.totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div style={{marginBottom: '16px'}}>
              <h3 style={{fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>Delivery Address</h3>
              <div style={{backgroundColor: 'var(--gray-50)', borderRadius: '6px', padding: '12px', border: '1px solid var(--gray-200)'}}>
                <p style={{fontSize: '13px', fontWeight: '600', marginBottom: '4px'}}>{order.deliveryAddress.name || 'N/A'}</p>
                <p style={{fontSize: '12px', color: 'var(--gray-600)', marginBottom: '4px'}}>
                  {order.deliveryAddress.address || order.deliveryAddress.street}
                  {order.deliveryAddress.landmark && `, ${order.deliveryAddress.landmark}`}
                </p>
                <p style={{fontSize: '12px', color: 'var(--gray-600)', marginBottom: '4px'}}>
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}
                </p>
                {order.deliveryAddress.phone && (
                  <p style={{fontSize: '12px', color: 'var(--gray-600)'}}>📱 {order.deliveryAddress.phone}</p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{display: 'flex', gap: '8px', marginBottom: '12px'}}>
            <button 
              className="btn btn-primary"
              style={{flex: 1}}
              onClick={() => navigate('/dashboard', { state: { tab: 'orders' } })}
            >
              📦 Track Order
            </button>
            <button 
              className="btn btn-outline"
              style={{flex: 1}}
              onClick={() => navigate('/select-location')}
            >
              🛒 Continue Shopping
            </button>
          </div>

          {/* Additional Info */}
          <div style={{backgroundColor: '#f0f9ff', borderRadius: '6px', padding: '12px', borderLeft: '4px solid var(--blue)'}}>
            <p style={{fontSize: '12px', color: 'var(--gray-700)', marginBottom: '6px'}}>📧 A confirmation email has been sent to your registered email address.</p>
            <p style={{fontSize: '12px', color: 'var(--gray-700)'}}>💬 You can track your order status in the Dashboard → My Orders section.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

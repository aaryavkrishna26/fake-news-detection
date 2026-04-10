import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="cart-container">
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2>Please login to view your cart</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/login')}
            style={{ marginTop: '20px' }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleRemoveItem = (materialId) => {
    removeFromCart(materialId);
  };

  const handleQuantityChange = (materialId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(materialId, newQuantity);
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const subtotal = getCartTotal();
  const gst = (subtotal * 0.18).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(gst)).toFixed(2);

  return (
    <div className="cart-container">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <h1 className="page-title">🛒 Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
            <h2 style={{ marginBottom: '16px', color: '#333' }}>Your cart is empty</h2>
            <p style={{ color: '#999', marginBottom: '24px' }}>Add some materials to get started</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/select-location')}
            >
              Browse Materials
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
            {/* Cart Items */}
            <div>
              <h2 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '600' }}>
                Items ({cartItems.length})
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    style={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      padding: '16px',
                      backgroundColor: '#fff',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '600', color: '#1a1a1a' }}>
                        {item.category}
                      </h3>
                      <p style={{ margin: '4px 0', fontSize: '14px', color: '#666' }}>
                        by {item.shopName}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: '600', color: '#0066cc' }}>
                        ₹{item.price}/{item.unit}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '13px', color: '#999' }}>
                        {item.quantity} {item.unit} × ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f5f5f5', padding: '4px', borderRadius: '4px' }}>
                        <button
                          style={{
                            width: '28px',
                            height: '28px',
                            border: 'none',
                            backgroundColor: '#0066cc',
                            color: 'white',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span style={{ width: '35px', textAlign: 'center', fontWeight: '600', fontSize: '14px' }}>
                          {item.quantity}
                        </span>
                        <button
                          style={{
                            width: '28px',
                            height: '28px',
                            border: 'none',
                            backgroundColor: '#0066cc',
                            color: 'white',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#f5f5f5',
                          border: '1px solid #e0e0e0',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          color: '#d32f2f',
                          fontWeight: '600'
                        }}
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                padding: '16px',
                backgroundColor: '#fafafa',
                height: 'fit-content'
              }}
            >
              <h2 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: '600' }}>Order Summary</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>GST (18%)</span>
                  <span>₹{gst}</span>
                </div>
              </div>

              <div
                style={{
                  borderTop: '2px solid #e0e0e0',
                  paddingTop: '12px',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#0066cc'
                }}
              >
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '8px' }}
                onClick={handleCheckout}
              >
                Proceed to Checkout →
              </button>

              <button
                className="btn btn-outline"
                style={{ width: '100%' }}
                onClick={() => navigate('/select-location')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

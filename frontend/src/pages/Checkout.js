import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { cartItems, clearCart, getCartTotal } = useContext(CartContext);

  const [step, setStep] = useState(1); // Step 1: Address, Step 2: Payment
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    street: '',
    landmark: '',
    city: '',
    pincode: '',
    state: '',
    paymentMethod: 'cod',
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  });

  const INDIAN_STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh', 'Andaman & Nicobar', 'Daman & Diu', 'Dadra & Nagar Haveli', 'Lakshadweep'];

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    // Fetch user profile
    fetchUserProfile();
  }, [token, cartItems, navigate]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(prev => ({
        ...prev,
        fullName: response.data.name || '',
        mobile: response.data.phone || '',
        city: response.data.city || '',
        state: response.data.state || '',
        street: response.data.address || '',
        pincode: response.data.pincode || ''
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile must be 10 digits';
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (formData.paymentMethod === 'card') {
      if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) newErrors.cardNumber = 'Card number must be 16 digits';
      if (!formData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
      if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Format: MM/YY';
      if (!/^\d{3}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 digits';
    } else if (formData.paymentMethod === 'upi') {
      if (!formData.upiId || !/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/.test(formData.upiId)) newErrors.upiId = 'Invalid UPI ID format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const orderData = {
        paymentMethod: formData.paymentMethod,
        cartItems: cartItems.map(item => ({
          material: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        deliveryAddress: {
          fullName: formData.fullName,
          mobile: formData.mobile,
          pincode: formData.pincode,
          street: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state
        }
      };

      const response = await axios.post(
        'http://localhost:5000/api/orders/create',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearCart();
      navigate(`/order-success/${response.data.order._id}`);
    } catch (error) {
      console.error('Order creation error:', error.response?.data || error);
      setErrors({ submit: error.response?.data?.error || error.response?.data?.message || 'Failed to place order' });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const gst = (subtotal * 0.18).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(gst)).toFixed(2);

  return (
    <div className="checkout-container">
      <div className="container" style={{ maxWidth: '1000px' }}>
        <h1 className="page-title">🛍️ Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
          {/* Main Checkout Form */}
          <div>
            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: step >= 1 ? '#0066cc' : '#e0e0e0',
                color: step >= 1 ? 'white' : '#999',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                1
              </div>
              <div style={{
                flex: 1,
                height: '2px',
                backgroundColor: step >= 2 ? '#0066cc' : '#e0e0e0',
                margin: '0 16px'
              }}></div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: step >= 2 ? '#0066cc' : '#e0e0e0',
                color: step >= 2 ? 'white' : '#999',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                2
              </div>
            </div>

            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '24px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '20px', fontWeight: '600' }}>📍 Delivery Address</h2>

                {errors.fullName && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '8px' }}>{errors.fullName}</p>}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: errors.fullName ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {errors.mobile && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '8px' }}>{errors.mobile}</p>}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: errors.mobile ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    {errors.pincode && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '4px' }}>{errors.pincode}</p>}
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pincode"
                      maxLength="6"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: errors.pincode ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    {errors.city && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '4px' }}>{errors.city}</p>}
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: errors.city ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                        borderRadius: '4px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {errors.street && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '8px' }}>{errors.street}</p>}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Street Address *</label>
                  <textarea
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="House no / Building / Street"
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: errors.street ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>Landmark (Optional)</label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g., Near XYZ Park"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d0d0d0',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {errors.state && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '8px' }}>{errors.state}</p>}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', fontSize: '14px' }}>State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: errors.state ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                      borderRadius: '4px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '16px' }}
                  onClick={handleContinueToPayment}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <div style={{ backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '6px', padding: '24px' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '20px', fontWeight: '600' }}>💳 Payment Method</h2>

                {errors.submit && <p style={{ color: '#d32f2f', marginBottom: '16px', fontSize: '14px' }}>{errors.submit}</p>}

                {/* Cash on Delivery */}
                <div
                  onClick={() => { handleInputChange({ target: { name: 'paymentMethod', value: 'cod' } }); setErrors({}); }}
                  style={{
                    padding: '16px',
                    border: formData.paymentMethod === 'cod' ? '2px solid #0066cc' : '1px solid #d0d0d0',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    backgroundColor: formData.paymentMethod === 'cod' ? '#f0f7ff' : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleInputChange}
                    />
                    <div>
                      <label style={{ fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>💵 Cash on Delivery</label>
                      <p style={{ fontSize: '13px', color: '#666', margin: '4px 0 0 0' }}>Pay when your order arrives</p>
                    </div>
                  </div>
                </div>

                {/* Card Payment */}
                <div
                  onClick={() => { handleInputChange({ target: { name: 'paymentMethod', value: 'card' } }); setErrors({}); }}
                  style={{
                    padding: '16px',
                    border: formData.paymentMethod === 'card' ? '2px solid #0066cc' : '1px solid #d0d0d0',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    backgroundColor: formData.paymentMethod === 'card' ? '#f0f7ff' : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                    />
                    <label style={{ fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>💳 Credit/Debit Card</label>
                  </div>

                  {formData.paymentMethod === 'card' && (
                    <div style={{ marginLeft: '28px' }}>
                      {errors.cardNumber && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '8px' }}>{errors.cardNumber}</p>}
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                        maxLength="19"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: errors.cardNumber ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                          borderRadius: '4px',
                          fontSize: '14px',
                          marginBottom: '8px',
                          boxSizing: 'border-box'
                        }}
                      />

                      {errors.cardholderName && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '8px' }}>{errors.cardholderName}</p>}
                      <input
                        type="text"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="Cardholder Name"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: errors.cardholderName ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                          borderRadius: '4px',
                          fontSize: '14px',
                          marginBottom: '8px',
                          boxSizing: 'border-box'
                        }}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div>
                          {errors.expiryDate && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '4px' }}>{errors.expiryDate}</p>}
                          <input
                            type="text"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            maxLength="5"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: errors.expiryDate ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                              borderRadius: '4px',
                              fontSize: '14px',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                        <div>
                          {errors.cvv && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '4px' }}>{errors.cvv}</p>}
                          <input
                            type="password"
                            name="cvv"
                            value={formData.cvv}
                            onChange={handleInputChange}
                            placeholder="CVV"
                            maxLength="3"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              border: errors.cvv ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                              borderRadius: '4px',
                              fontSize: '14px',
                              boxSizing: 'border-box'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI Payment */}
                <div
                  onClick={() => { handleInputChange({ target: { name: 'paymentMethod', value: 'upi' } }); setErrors({}); }}
                  style={{
                    padding: '16px',
                    border: formData.paymentMethod === 'upi' ? '2px solid #0066cc' : '1px solid #d0d0d0',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    cursor: 'pointer',
                    backgroundColor: formData.paymentMethod === 'upi' ? '#f0f7ff' : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleInputChange}
                    />
                    <label style={{ fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>📱 UPI</label>
                  </div>

                  {formData.paymentMethod === 'upi' && (
                    <div style={{ marginLeft: '28px' }}>
                      {errors.upiId && <p style={{ color: '#d32f2f', fontSize: '13px', marginBottom: '8px' }}>{errors.upiId}</p>}
                      <input
                        type="text"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        placeholder="yourname@upi"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: errors.upiId ? '1px solid #d32f2f' : '1px solid #d0d0d0',
                          borderRadius: '4px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '24px' }}>
                  <button
                    className="btn btn-outline"
                    style={{ padding: '12px 16px', fontSize: '16px' }}
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '12px 16px', fontSize: '16px' }}
                    onClick={handlePlaceOrder}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : '✓ Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div
            style={{
              backgroundColor: '#fafafa',
              border: '1px solid #e0e0e0',
              borderRadius: '6px',
              padding: '16px',
              height: 'fit-content'
            }}
          >
            <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: '600' }}>Order Summary</h3>

            {cartItems.map((item) => (
              <div key={item._id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '13px', fontWeight: '600', color: '#333' }}>
                  {item.category}
                </p>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                  {item.quantity} × ₹{item.price} = ₹{(item.quantity * item.price).toFixed(2)}
                </p>
              </div>
            ))}

            <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px' }}>
                <span>GST (18%)</span>
                <span>₹{gst}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '15px',
                fontWeight: '700',
                color: '#0066cc',
                borderTop: '1px solid #e0e0e0',
                paddingTop: '8px'
              }}>
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

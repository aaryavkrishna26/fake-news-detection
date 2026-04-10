import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { cartItems, clearCart, getCartTotal } = useContext(CartContext);
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [userProfile, setUserProfile] = useState (null);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    pincode: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    addressType: 'home',
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
      navigate('/dashboard');
      return;
    }

    fetchUserProfile();
  }, [token, cartItems]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(response.data);
      setFormData(prev => ({
        ...prev,
        fullName: response.data.name || '',
        mobile: response.data.phone || '',
        city: response.data.city || '',
        state: response.data.state || '',
        pincode: response.data.pincode || '',
        street: response.data.address || ''
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

  const handleContinue = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const orderData = {
        paymentMethod: formData.paymentMethod === 'cod' ? 'cash_on_delivery' : formData.paymentMethod,
        deliveryAddress: {
          name: formData.fullName,
          phone: formData.mobile,
          pincode: formData.pincode,
          address: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          addressType: formData.addressType
        }
      };

      const response = await axios.post(
        'http://localhost:5000/api/orders/create',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await clearCart();
      navigate(`/order-success/${response.data.order._id}`);
    } catch (error) {
      setErrors({ submit: error.response?.data?.error || 'Failed to place order' });
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = getCartTotal();
  const gst = (cartTotal * 0.18).toFixed(2);
  const finalTotal = (parseFloat(cartTotal) + parseFloat(gst)).toFixed(2);

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>🛒 Checkout</h1>
      </div>

      <div className="checkout-layout">
        {/* Main Content */}
        <div className="checkout-main">
          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>
              <div className="step-num">1</div>
              <div className="step-label">Address</div>
            </div>
            <div className="step-connector"></div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>
              <div className="step-num">2</div>
              <div className="step-label">Payment</div>
            </div>
          </div>

          {/* STEP 1: Delivery Address */}
          {step === 1 && (
            <div className="checkout-step">
              <h2>📍 Delivery Address</h2>

              {errors.fullName && <div className="error-msg">{errors.fullName}</div>}
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={errors.fullName ? 'error' : ''}
                />
              </div>

              {errors.mobile && <div className="error-msg">{errors.mobile}</div>}
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="10-digit mobile number"
                  className={errors.mobile ? 'error' : ''}
                  maxLength="10"
                />
              </div>

              <div className="form-row">
                {errors.pincode && <div className="error-msg">{errors.pincode}</div>}
                <div className="form-group">
                  <label>Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit pincode"
                    className={errors.pincode ? 'error' : ''}
                    maxLength="6"
                  />
                </div>

                {errors.city && <div className="error-msg">{errors.city}</div>}
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className={errors.city ? 'error' : ''}
                  />
                </div>
              </div>

              {errors.street && <div className="error-msg">{errors.street}</div>}
              <div className="form-group">
                <label>House No / Building / Street *</label>
                <textarea
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Enter street address"
                  rows="2"
                  className={errors.street ? 'error' : ''}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  placeholder="e.g., Near XYZ Park"
                />
              </div>

              {errors.state && <div className="error-msg">{errors.state}</div>}
              <div className="form-group">
                <label>State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'error' : ''}
                >
                  <option value="">Select State</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Address Type</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="addressType"
                      value="home"
                      checked={formData.addressType === 'home'}
                      onChange={handleInputChange}
                    />
                    🏠 Home
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="addressType"
                      value="work"
                      checked={formData.addressType === 'work'}
                      onChange={handleInputChange}
                    />
                    💼 Work
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="addressType"
                      value="other"
                      checked={formData.addressType === 'other'}
                      onChange={handleInputChange}
                    />
                    📌 Other
                  </label>
                </div>
              </div>

              <button className="btn-continue" onClick={handleContinue}>
                Save & Continue →
              </button>
            </div>
          )}

          {/* STEP 2: Payment Method */}
          {step === 2 && (
            <div className="checkout-step">
              <h2>💳 Payment Method</h2>

              {errors.submit && <div className="error-msg" style={{ marginBottom: '20px' }}>{errors.submit}</div>}

              {/* COD Option */}
              <div className={`payment-option ${formData.paymentMethod === 'cod' ? 'selected' : ''}`}>
                <div className="payment-header">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <label>💵 Cash on Delivery</label>
                </div>
                <p className="payment-desc">Pay when your order arrives</p>
                <p className="payment-limit">Available for orders up to ₹50,000</p>
              </div>

              {/* Card Option */}
              <div className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}>
                <div className="payment-header">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleInputChange}
                  />
                  <label>💳 Credit/Debit Card</label>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="payment-details">
                    {errors.cardNumber && <div className="error-msg">{errors.cardNumber}</div>}
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                      maxLength="19"
                      className={errors.cardNumber ? 'error' : ''}
                    />

                    {errors.cardholderName && <div className="error-msg">{errors.cardholderName}</div>}
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="Cardholder Name"
                      className={errors.cardholderName ? 'error' : ''}
                    />

                    <div className="card-row">
                      {errors.expiryDate && <div className="error-msg">{errors.expiryDate}</div>}
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className={errors.expiryDate ? 'error' : ''}
                      />

                      {errors.cvv && <div className="error-msg">{errors.cvv}</div>}
                      <input
                        type="password"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="CVV"
                        maxLength="3"
                        className={errors.cvv ? 'error' : ''}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* UPI Option */}
              <div className={`payment-option ${formData.paymentMethod === 'upi' ? 'selected' : ''}`}>
                <div className="payment-header">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={formData.paymentMethod === 'upi'}
                    onChange={handleInputChange}
                  />
                  <label>📱 UPI</label>
                </div>

                {formData.paymentMethod === 'upi' && (
                  <div className="payment-details">
                    {errors.upiId && <div className="error-msg">{errors.upiId}</div>}
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="yourname@upi"
                      className={errors.upiId ? 'error' : ''}
                    />
                  </div>
                )}
              </div>

              <div className="step-actions">
                <button className="btn-back" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button 
                  className="btn-place-order" 
                  onClick={handlePlaceOrder}
                  disabled={loading}
                >
                  {loading ? '⏳ Processing...' : '✓ Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>

          <div className="summary-items">
            {cartItems.map(item => (
              <div key={item._id} className="summary-item">
                <div>
                  <p className="item-name">{item.name}</p>
                  <p className="item-qty">{item.quantity} × ₹{item.price}</p>
                </div>
                <p className="item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="summary-divider"></div>

          <div className="summary-calc">
            <div className="calc-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="calc-row">
              <span>GST (18%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="calc-row">
              <span>Delivery</span>
              <span className="free">FREE</span>
            </div>
            <div className="calc-divider"></div>
            <div className="calc-total">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

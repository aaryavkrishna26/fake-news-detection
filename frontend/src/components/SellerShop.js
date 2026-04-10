import React, { useState, useEffect } from 'react';
import {
  getSellerProfile,
  updateSellerProfile,
  getSellerOrders,
  updateOrderStatus
} from '../api/sellerApi';
import './SellerShop.css';

const SellerShop = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  // Profile data
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState({ totalListings: 0, totalOrders: 0 });
  const [orders, setOrders] = useState([]);

  // Form data
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    contactNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    shopCategory: '',
    gstNumber: '',
    shopBio: ''
  });

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Ladakh'
  ];

  const SHOP_CATEGORIES = [
    'Cement Dealer',
    'Sand Supplier',
    'Steel Supplier',
    'Bricks Dealer',
    'Paint Shop',
    'Tiles & Flooring',
    'Pipes & Fittings',
    'Electrical Supplier',
    'Aggregates Supplier',
    'Multi-Category Store'
  ];

  // Load profile on mount
  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === 'orders' && orders.length === 0) {
      loadOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await getSellerProfile();
      setProfileData(response.data.profile);
      setStats({
        totalListings: response.data.totalListings,
        totalOrders: response.data.totalOrders
      });
      setFormData({
        shopName: response.data.profile?.shopName || '',
        ownerName: response.data.profile?.ownerName || '',
        email: response.data.profile?.email || '',
        contactNumber: response.data.profile?.contactNumber || '',
        address: response.data.profile?.address || {
          street: '',
          city: '',
          state: '',
          pincode: ''
        },
        shopCategory: response.data.profile?.shopCategory || '',
        gstNumber: response.data.profile?.gstNumber || '',
        shopBio: response.data.profile?.shopBio || ''
      });
      setError('');
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await getSellerOrders();
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('address_')) {
      const field = name.replace('address_', '');
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateForm = () => {
    if (!formData.shopName.trim()) return 'Shop Name is required';
    if (!formData.ownerName.trim()) return 'Owner Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!formData.contactNumber.trim()) return 'Contact Number is required';
    if (!/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      return 'Contact Number must be 10 digits';
    }
    if (!formData.address.street.trim()) return 'Street Address is required';
    if (!formData.address.city.trim()) return 'City is required';
    if (!formData.address.state) return 'State is required';
    if (!/^\d{6}$/.test(formData.address.pincode)) return 'Pincode must be 6 digits';
    if (!formData.shopCategory) return 'Shop Category is required';
    return '';
  };

  const handleSaveProfile = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await updateSellerProfile(formData);
      setSuccessMessage('✅ Profile updated successfully!');
      setIsEditMode(false);
      await loadProfile();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
      setSuccessMessage('✅ Order status updated!');
      await loadOrders();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update order status');
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getFilteredOrders = () => {
    if (filterStatus === 'All') return orders;
    return orders.filter(order => order.orderStatus === filterStatus);
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#f97316',
      'Confirmed': '#3b82f6',
      'Dispatched': '#8b5cf6',
      'Delivered': '#16a34a'
    };
    return colors[status] || '#6b7280';
  };

  if (loading && !profileData) {
    return (
      <div className="seller-shop">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!profileData && !isEditMode) {
    return (
      <div className="seller-shop">
        <div className="empty-profile">
          <div className="empty-icon">🏪</div>
          <h2>Complete Your Shop Profile</h2>
          <p>Set up your shop profile so buyers can find and trust you!</p>
          <button
            className="btn-start-profile"
            onClick={() => setIsEditMode(true)}
          >
            ✏️ Set Up Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="seller-shop">
      {/* Messages */}
      {error && <div className="alert alert-error">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Tab Navigation */}
      <div className="shop-tabs">
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          🏪 My Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 Orders Received
        </button>
      </div>

      {/* TAB 1: My Profile */}
      {activeTab === 'profile' && (
        <div className="tab-content">
          {!isEditMode ? (
            // Display Mode
            <div className="profile-display">
              {/* Warning Banner */}
              {profileData && !profileData.isProfileComplete && (
                <div className="incomplete-banner">
                  <span>⚠️ Your profile is incomplete. Complete it so buyers can trust you!</span>
                  <button
                    className="btn-complete-now"
                    onClick={() => setIsEditMode(true)}
                  >
                    Complete Now
                  </button>
                </div>
              )}

              {/* Shop Header Card */}
              <div className="shop-header-card">
                <div className="header-top">
                  <div className="shop-icon-section">
                    <div className="shop-icon">🏗️</div>
                  </div>
                  <div className="shop-info">
                    <h1 className="shop-name">
                      {profileData?.shopName || 'Your Shop'}
                    </h1>
                    <p className="owner-name">
                      {profileData?.ownerName || 'Owner Name'}
                    </p>
                    <div className="status-badge">
                      {profileData?.isProfileComplete ? (
                        <span className="status-complete">✓ Active</span>
                      ) : (
                        <span className="status-incomplete">⊕ Incomplete</span>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn-edit-profile"
                    onClick={() => setIsEditMode(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="details-grid">
                <div className="detail-row">
                  <span className="detail-label">📛 Shop Name</span>
                  <span className="detail-value">
                    {profileData?.shopName || 'Not Added'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">👤 Owner Name</span>
                  <span className="detail-value">
                    {profileData?.ownerName || 'Not Added'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📧 Email ID</span>
                  <span className="detail-value">
                    {profileData?.email || 'Not Added'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📞 Contact Number</span>
                  <span className="detail-value">
                    {profileData?.contactNumber || 'Not Added'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🏠 Shop Address</span>
                  <span className="detail-value">
                    {profileData?.address?.street &&
                    profileData?.address?.city &&
                    profileData?.address?.state &&
                    profileData?.address?.pincode
                      ? `${profileData.address.street}, ${profileData.address.city}, ${profileData.address.state} - ${profileData.address.pincode}`
                      : 'Not Added'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🏷️ Shop Category</span>
                  <span className="detail-value">
                    {profileData?.shopCategory || 'Not Added'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📋 GST Number</span>
                  <span className="detail-value">
                    {profileData?.gstNumber || 'Not Added'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📝 About Shop</span>
                  <span className="detail-value">
                    {profileData?.shopBio || 'Not Added'}
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-icon">📦</span>
                  <span className="stat-label">Total Listings</span>
                  <span className="stat-value">{stats.totalListings}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🛒</span>
                  <span className="stat-label">Orders Received</span>
                  <span className="stat-value">{stats.totalOrders}</span>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">⭐</span>
                  <span className="stat-label">Rating</span>
                  <span className="stat-value">Coming Soon</span>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="profile-edit">
              <h2>Edit Your Shop Profile</h2>
              <form className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Shop Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleFormChange}
                      placeholder="e.g., BuildMart Delhi"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Owner Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleFormChange}
                      placeholder="Your full name"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Email ID <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="your@email.com"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Contact Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleFormChange}
                      placeholder="10-digit mobile number"
                      className="form-input"
                      maxLength="10"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <textarea
                    name="address_street"
                    value={formData.address.street}
                    onChange={handleFormChange}
                    placeholder="Shop address street"
                    className="form-textarea"
                    rows="2"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="address_city"
                      value={formData.address.city}
                      onChange={handleFormChange}
                      placeholder="e.g., Delhi"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <select
                      name="address_state"
                      value={formData.address.state}
                      onChange={handleFormChange}
                      className="form-input"
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      name="address_pincode"
                      value={formData.address.pincode}
                      onChange={handleFormChange}
                      placeholder="6-digit pincode"
                      className="form-input"
                      maxLength="6"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Shop Category <span className="required">*</span>
                    </label>
                    <select
                      name="shopCategory"
                      value={formData.shopCategory}
                      onChange={handleFormChange}
                      className="form-input"
                    >
                      <option value="">Select Category</option>
                      {SHOP_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>GST Number</label>
                    <input
                      type="text"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleFormChange}
                      placeholder="15-char GST number (optional)"
                      className="form-input"
                      maxLength="15"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>
                    About Your Shop{' '}
                    <span className="char-count">
                      ({formData.shopBio.length}/300)
                    </span>
                  </label>
                  <textarea
                    name="shopBio"
                    value={formData.shopBio}
                    onChange={handleFormChange}
                    placeholder="Tell buyers about your shop..."
                    className="form-textarea"
                    rows="4"
                    maxLength="300"
                  />
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-save"
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : '💾 Save Profile'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsEditMode(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Orders Received */}
      {activeTab === 'orders' && (
        <div className="tab-content">
          <div className="orders-header">
            <h2>Orders Received</h2>
            <div className="orders-controls">
              <select
                className="filter-dropdown"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Orders</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
              <span className="orders-count">
                {getFilteredOrders().length} {filterStatus === 'All' ? 'orders' : filterStatus.toLowerCase()} total
              </span>
            </div>
          </div>

          {getFilteredOrders().length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">📭</div>
              <h3>No orders yet!</h3>
              <p>Share your shop with buyers to get started.</p>
            </div>
          ) : (
            <div className="orders-list">
              {getFilteredOrders().map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id-section">
                      <h3 className="order-id">Order #{order.orderId}</h3>
                      <span className="order-date">
                        📅 {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <span
                      className="order-status-badge"
                      style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                    >
                      {order.orderStatus}
                    </span>
                  </div>

                  <div className="order-divider"></div>

                  <div className="order-buyer-info">
                    <p>
                      <span className="info-icon">👤</span>
                      <strong>Buyer:</strong> {order.buyerName}
                    </p>
                    <p>
                      <span className="info-icon">📞</span>
                      <strong>Contact:</strong> {order.buyerPhone}
                    </p>
                    <p>
                      <span className="info-icon">📍</span>
                      <strong>Deliver to:</strong> {order.deliveryAddress?.street},{' '}
                      {order.deliveryAddress?.city} -{' '}
                      {order.deliveryAddress?.pincode}
                    </p>
                  </div>

                  <div className="order-items">
                    <h4>📦 Items Ordered:</h4>
                    <ul>
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          {item.name} × {item.quantity} {item.unit} — ₹
                          {(item.price * item.quantity).toLocaleString('en-IN')}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-totals">
                    <p>
                      <strong>💰 Total:</strong> ₹
                      {order.totalAmount.toLocaleString('en-IN')}
                    </p>
                    <p>
                      <strong>💳 Payment:</strong> {order.paymentMethod}
                    </p>
                  </div>

                  <div className="order-actions">
                    <div className="status-select-group">
                      <label>Update Status:</label>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={updatingOrderId === order._id}
                        className="status-dropdown"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      {updatingOrderId === order._id && (
                        <span className="updating-spinner">⏳</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerShop;

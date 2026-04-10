import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner, EmptyState } from '../components/UIComponents';
import '../styles/PersonalDashboard.css';

const PersonalDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    activeOrders: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    if (!token) {
      navigate('/login');
      return;
    }

    // Load user data
    setUser({
      name: userName || 'User',
      email: userEmail || 'user@example.com',
      role: userRole || 'buyer',
      joinDate: new Date().toLocaleDateString(),
      phone: '+91 XXXXXXXXXX',
      address: 'Not set',
    });

    // Mock orders data
    const mockOrders = [
      {
        id: 'ORD001',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        items: 'Cement, Sand',
        total: 5000,
        status: 'completed',
      },
      {
        id: 'ORD002',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        items: 'Steel Rods',
        total: 8500,
        status: 'completed',
      },
      {
        id: 'ORD003',
        date: new Date().toLocaleDateString(),
        items: 'Bricks, Mortar',
        total: 3200,
        status: 'pending',
      },
    ];

    setOrders(mockOrders);
    setStats({
      totalOrders: mockOrders.length,
      totalSpent: mockOrders.reduce((acc, ord) => acc + ord.total, 0),
      activeOrders: mockOrders.filter((o) => o.status === 'pending').length,
    });

    setLoading(false);
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  if (!user) {
    return (
      <EmptyState
        icon="🔒"
        title="Access Denied"
        message="Please log in to view your dashboard"
        actionLabel="Go to Login"
        onAction={() => navigate('/login')}
      />
    );
  }

  return (
    <div className="personal-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-title-section">
            <div className="dashboard-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="dashboard-title-info">
              <h1 className="dashboard-title">Welcome, {user.name}!</h1>
              <p className="dashboard-subtitle">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <div className="stat-value">₹{stats.totalSpent.toLocaleString()}</div>
              <div className="stat-label">Total Spent</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <div className="stat-value">{stats.activeOrders}</div>
              <div className="stat-label">Active Orders</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile Info
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders History
          </button>
          <button
            className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            ❤️ Saved Items
          </button>
          <button
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          {user.role === 'seller' && (
            <button
              className={`tab ${activeTab === 'addMaterials' ? 'active' : ''}`}
              onClick={() => setActiveTab('addMaterials')}
            >
              ➕ Add Materials
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="dashboard-content">
          {/* Profile Info Tab */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  <div className="profile-value">{user.name}</div>
                </div>
                <div className="profile-field">
                  <label>Email</label>
                  <div className="profile-value">{user.email}</div>
                </div>
                <div className="profile-field">
                  <label>Phone</label>
                  <div className="profile-value">{user.phone}</div>
                </div>
                <div className="profile-field">
                  <label>Account Type</label>
                  <div className="profile-value capitalize">{user.role}</div>
                </div>
                <div className="profile-field">
                  <label>Delivery Address</label>
                  <div className="profile-value">{user.address}</div>
                </div>
                <div className="profile-field">
                  <label>Member Since</label>
                  <div className="profile-value">{user.joinDate}</div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '20px' }}>
                Edit Profile
              </button>
            </div>
          )}

          {/* Orders History Tab */}
          {activeTab === 'orders' && (
            <div className="orders-section">
              <h2>Order History</h2>
              {orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-item">
                      <div className="order-main">
                        <div className="order-id-date">
                          <h3 className="order-id">Order {order.id}</h3>
                          <span className="order-date">{order.date}</span>
                        </div>
                        <div className="order-items">
                          <strong>Items:</strong> {order.items}
                        </div>
                      </div>
                      <div className="order-side">
                        <div className="order-total">₹{order.total.toLocaleString()}</div>
                        <span
                          className={`order-status status-${order.status}`}
                        >
                          {order.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="📭"
                  title="No Orders Yet"
                  message="Start shopping to see your orders here"
                  actionLabel="Browse Products"
                  onAction={() => navigate('/select-location')}
                />
              )}
            </div>
          )}

          {/* Saved Items Tab */}
          {activeTab === 'saved' && (
            <div className="saved-section">
              <h2>Saved Items</h2>
              <EmptyState
                icon="❤️"
                title="No Saved Items"
                message="Save items to view them later"
                actionLabel="Browse Products"
                onAction={() => navigate('/select-location')}
              />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <h2>Settings</h2>
              <div className="settings-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Email Notifications</h3>
                    <p>Receive order updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="setting-toggle"
                  />
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>SMS Notifications</h3>
                    <p>Receive order updates via SMS</p>
                  </div>
                  <input type="checkbox" className="setting-toggle" />
                </div>
              </div>
              <div className="settings-actions">
                <button className="btn btn-outline">Change Password</button>
                <button className="btn btn-outline danger">Delete Account</button>
              </div>
            </div>
          )}

          {/* Add Materials Tab (Sellers Only) */}
          {activeTab === 'addMaterials' && user.role === 'seller' && (
            <div className="add-materials-section">
              <h2>Add New Material</h2>
              <form className="material-form">
                <div className="form-group">
                  <label>Material Category</label>
                  <select className="form-input" required>
                    <option value="">Select Category</option>
                    <option value="cement">Cement</option>
                    <option value="sand">Sand</option>
                    <option value="steel">Steel</option>
                    <option value="bricks">Bricks</option>
                    <option value="aggregates">Aggregates</option>
                    <option value="tiles">Tiles</option>
                    <option value="paint">Paint</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Material Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., Premium Cement Bag"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Enter price"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Available Quantity</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="Enter quantity"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Unit (kg, bags, m³, etc.)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., bags, kg, m³"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-input"
                    rows="4"
                    placeholder="Add details about your material (quality, specification, etc.)"
                  />
                </div>

                <div className="form-group">
                  <label>City/Location</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Where are you selling this material"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    ➕ Add Material
                  </button>
                  <button type="reset" className="btn btn-outline">
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalDashboard;

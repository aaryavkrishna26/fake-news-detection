import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForms.css';

const Login = ({ setUser }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userEmail', res.data.user.email);
      localStorage.setItem('userPhone', res.data.user.phone);
      localStorage.setItem('userLocation', res.data.user.location);
      setUser(res.data.user);
      if (res.data.user.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error details:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoUser = {
      id: role === 'buyer' ? 'demo-buyer-001' : 'demo-seller-001',
      name: role === 'buyer' ? 'Demo Buyer' : 'Demo Seller',
      role: role,
      email: role === 'buyer' ? 'buyer@demo.com' : 'seller@demo.com',
      phone: '9999999999',
      location: 'Delhi',
    };
    localStorage.setItem('token', 'demo-token-' + role);
    localStorage.setItem('userRole', demoUser.role);
    localStorage.setItem('userName', demoUser.name);
    localStorage.setItem('userId', demoUser.id);
    localStorage.setItem('userEmail', demoUser.email);
    localStorage.setItem('userPhone', demoUser.phone);
    localStorage.setItem('userLocation', demoUser.location);
    setUser(demoUser);
    if (role === 'seller') {
      navigate('/seller/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-build">Build</span>
          <span className="logo-mart">Mart</span>
        </div>
        <h1 className="auth-heading">Login</h1>
        <p className="auth-subtext">Welcome back! Please login to continue.</p>

        {/* Demo Login Buttons */}
        <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
          <p style={{ fontSize: '13px', color: '#0369a1', marginBottom: '10px', fontWeight: '600' }}>🎯 Quick Demo Access:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleDemoLogin('buyer')}
              style={{ flex: 1, padding: '8px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              👤 Demo Buyer
            </button>
            <button
              onClick={() => handleDemoLogin('seller')}
              style={{ flex: 1, padding: '8px', background: '#f97316', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            >
              🏪 Demo Seller
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="label">Email Address</label>
            <input
              type="email"
              className="input"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer-text">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
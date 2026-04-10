import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './AuthForms.css';

const Register = ({ setUser }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    location: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userRole', res.data.user.role);
      localStorage.setItem('userName', res.data.user.name);
      localStorage.setItem('userId', res.data.user.id);
      localStorage.setItem('userEmail', form.email);
      localStorage.setItem('userPhone', form.phone);
      localStorage.setItem('userLocation', form.location);
      setUser(res.data.user);
      
      // Redirect based on role
      if (res.data.user.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CITIES = ['Mumbai', 'Delhi', 'Lucknow', 'Jaipur', 'Indore'];

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-register">
        <div className="auth-logo">
          <span className="logo-build">Build</span>
          <span className="logo-mart">Mart</span>
        </div>
        
        <h1 className="auth-heading">Create Account</h1>
        <p className="auth-subtext">Join BuildMart to buy or sell materials</p>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selector */}
          <div className="role-selector">
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="buyer"
                checked={form.role === 'buyer'}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <span className="role-label">Buyer</span>
            </label>
            <label className="role-option">
              <input
                type="radio"
                name="role"
                value="seller"
                checked={form.role === 'seller'}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />
              <span className="role-label">Seller</span>
            </label>
          </div>
          
          <div className="form-group">
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input"
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="label">Email</label>
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
            <label className="label">Phone Number</label>
            <input
              type="tel"
              className="input"
              placeholder="10-digit phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="label">City</label>
            <select
              className="input"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
            >
              <option value="">Select your city</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Create a strong password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          
          {error && <p className="text-error">{error}</p>}
          
          <button
            type="submit"
            className="btn btn-orange btn-full"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        <p className="auth-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddMaterial.css';

const CATEGORIES = [
  'Cement',
  'Sand',
  'Steel/TMT Bars',
  'Bricks',
  'Aggregates',
  'Paint',
  'Tiles',
  'Pipes',
  'Electrical',
  'Wood/Timber'
];

const UNITS = ['per bag', 'per kg', 'per ton', 'per meter', 'per sqft', 'per liter', 'per piece', 'per bundle'];

const AddMaterial = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    category: '',
    price: '',
    quantity: '',
    unit: 'per bag',
    description: '',
    isAvailable: true
  });

  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/materials/seller-dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSellerInfo(response.data.shop);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching seller info:', error);
        setLoading(false);
      }
    };

    if (token) {
      fetchSellerInfo();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (submitError) setSubmitError('');
  };

  const validateForm = () => {
    if (!formData.category) {
      setSubmitError('Please select a material category');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setSubmitError('Please enter a valid price');
      return false;
    }
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      setSubmitError('Please enter a valid quantity');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!token) {
      setSubmitError('Please login to add materials');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      if (!sellerInfo) {
        setSubmitError('Seller information not loaded');
        setSubmitting(false);
        return;
      }

      await axios.post(
        'http://localhost:5000/api/materials',
        {
          category: formData.category,
          price: parseFloat(formData.price),
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          description: formData.description,
          isAvailable: formData.isAvailable,
          name: formData.category,
          shopName: sellerInfo.name,
          location: {
            city: sellerInfo.location,
            state: 'India',
            pincode: '000000',
            address: ''
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(true);
      setFormData({
        category: '',
        price: '',
        quantity: '',
        unit: 'per bag',
        description: '',
        isAvailable: true
      });

      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Error adding material:', err);
      setSubmitError(err.response?.data?.error || 'Failed to add material. Please try again.');
      setSuccess(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{padding: '24px'}}>
        <div className="container">
          <p style={{textAlign: 'center', color: 'var(--gray-600)'}}>Loading seller information...</p>
        </div>
      </div>
    );
  }

  if (!sellerInfo) {
    return (
      <div style={{padding: '24px'}}>
        <div className="container">
          <p style={{textAlign: 'center', color: 'var(--red)'}}>Unable to load seller information. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding: '24px'}}>
      <div className="container">
        <div style={{maxWidth: '600px', margin: '0 auto', backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h1 className="page-title">Add New Material</h1>
          <p style={{color: 'var(--gray-600)', fontSize: '14px', marginBottom: '16px', textAlign: 'center'}}>List your construction materials for sale</p>

          {success && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              backgroundColor: '#d4edda',
              color: '#155724',
              fontSize: '13px',
              border: '1px solid #c3e6cb'
            }}>
              ✓ Material added successfully! Redirecting to your dashboard...
            </div>
          )}

          {submitError && (
            <div style={{
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              fontSize: '13px',
              border: '1px solid #f5c6cb'
            }}>
              ✗ {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '20px'}}>
              <h3 style={{fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>🏪 Your Shop Details</h3>
              
              <div style={{backgroundColor: 'var(--gray-50)', borderRadius: '6px', padding: '12px', border: '1px solid var(--gray-200)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px'}}>
                  <span style={{color: 'var(--gray-600)'}}>Shop Name:</span>
                  <span style={{fontWeight: '600'}}>{sellerInfo.name}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px'}}>
                  <span style={{color: 'var(--gray-600)'}}>Location:</span>
                  <span style={{fontWeight: '600'}}>{sellerInfo.location}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px'}}>
                  <span style={{color: 'var(--gray-600)'}}>Contact:</span>
                  <span style={{fontWeight: '600'}}>{sellerInfo.phone}</span>
                </div>
              </div>
            </div>

            <div style={{marginBottom: '20px'}}>
              <h3 style={{fontSize: '14px', fontWeight: '600', marginBottom: '12px'}}>📋 Material Details</h3>
              
              <div className="form-group">
                <label className="label" htmlFor="category">Material Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px'}}>
                <div className="form-group">
                  <label className="label" htmlFor="price">Price (₹) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="input"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Qty"
                    className="input"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label" htmlFor="unit">Unit *</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="input"
                    required
                  >
                    {UNITS.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  placeholder="Add material details, grade, specifications, etc."
                  className="input"
                  style={{fontFamily: 'inherit'}}
                  rows="3"
                  onChange={handleChange}
                />
              </div>

              <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px'}}>
                <input
                  type="checkbox"
                  id="isAvailable"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
                <label htmlFor="isAvailable" style={{fontSize: '13px', cursor: 'pointer', margin: 0}}>Available for Sale</label>
              </div>
            </div>

            <div style={{display: 'flex', gap: '8px'}}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{flex: 1}}
                disabled={submitting}
              >
                {submitting ? 'Adding...' : '✓ Add Material'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{flex: 1}}
                onClick={() => navigate('/seller/dashboard')}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMaterial;

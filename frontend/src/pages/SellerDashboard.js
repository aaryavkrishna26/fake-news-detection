import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [shop, setShop] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/materials/seller-dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShop(response.data.shop);
      setMaterials(response.data.materials);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching seller data:', error);
      setMessage('Error loading dashboard');
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material._id);
    setFormData({
      price: material.price,
      quantity: material.quantity,
      isAvailable: material.isAvailable,
      description: material.description
    });
  };

  const handleSaveMaterial = async (materialId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/materials/${materialId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setMaterials(materials.map(m => 
        m._id === materialId ? { ...m, ...formData } : m
      ));

      setEditingMaterial(null);
      setMessage('Material updated successfully');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating material:', error);
      setMessage('Error updating material');
      setMessageType('error');
    }
  };

  const handleCancelEdit = () => {
    setEditingMaterial(null);
    setFormData({});
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  if (loading) {
    return <div className="dashboard-container"><div className="container"><p style={{color: 'var(--gray-600)', textAlign: 'center', padding: '24px'}}>Loading dashboard...</p></div></div>;
  }

  if (!shop) {
    return <div className="dashboard-container"><div className="container"><p style={{color: 'var(--red)', textAlign: 'center', padding: '24px'}}>Unable to load shop information</p></div></div>;
  }

  return (
    <div className="dashboard-container">
      <div className="container">
        <h1 className="page-title">🏪 {shop.name}</h1>
        <div style={{marginBottom: '12px'}}>
          <p style={{fontSize: '14px', color: 'var(--gray-600)'}}>📍 {shop.location}</p>
          <p style={{fontSize: '14px', color: 'var(--gray-600)'}}>📞 {shop.phone}</p>
        </div>

        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '16px',
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            fontSize: '13px',
            border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message}
          </div>
        )}

        <div style={{marginBottom: '24px'}}>
          <h2 style={{fontSize: '18px', marginBottom: '8px'}}>Your Materials & Inventory</h2>
          <p style={{fontSize: '13px', color: 'var(--gray-600)', marginBottom: '16px'}}>Total Materials: <strong>{materials.length}</strong></p>

          {materials.length === 0 ? (
            <p style={{color: 'var(--gray-600)', textAlign: 'center', padding: '24px', backgroundColor: 'var(--gray-50)', borderRadius: '6px'}}>No materials listed yet. Add your first material!</p>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px'}}>
              {materials.map(material => (
                <div key={material._id} style={{backgroundColor: 'white', border: '1px solid var(--gray-200)', borderRadius: '6px', overflow: 'hidden'}}>
                  {editingMaterial === material._id ? (
                    // Edit Mode
                    <div style={{padding: '16px'}}>
                      <h3 style={{fontSize: '14px', marginBottom: '12px', fontWeight: '600'}}>{material.name}</h3>
                      
                      <div className="form-group">
                        <label className="label">Price (₹)</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleFormChange}
                          className="input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="label">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleFormChange}
                          className="input"
                        />
                      </div>

                      <div className="form-group">
                        <label className="label">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleFormChange}
                          className="input"
                          rows="3"
                          style={{fontFamily: 'inherit'}}
                        />
                      </div>

                      <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'}}>
                        <input
                          type="checkbox"
                          name="isAvailable"
                          checked={formData.isAvailable}
                          onChange={handleFormChange}
                          id={`stock-${material._id}`}
                        />
                        <label htmlFor={`stock-${material._id}`} style={{fontSize: '13px', cursor: 'pointer', margin: 0}}>In Stock</label>
                      </div>

                      <div style={{display: 'flex', gap: '8px'}}>
                        <button 
                          className="btn btn-primary"
                          style={{flex: 1, fontSize: '13px', padding: '6px'}}
                          onClick={() => handleSaveMaterial(material._id)}
                        >
                          Save
                        </button>
                        <button 
                          className="btn btn-outline"
                          style={{flex: 1, fontSize: '13px', padding: '6px'}}
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div style={{padding: '16px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                        <h3 style={{fontSize: '14px', fontWeight: '600', margin: 0}}>{material.name}</h3>
                        <span className={`badge badge-${material.isAvailable ? 'success' : 'danger'}`} style={{fontSize: '11px'}}>
                          {material.isAvailable ? '✓ In Stock' : '✗ Out'}
                        </span>
                      </div>

                      <p style={{fontSize: '12px', color: 'var(--gray-600)', marginBottom: '8px'}}>{material.category}</p>
                      <p style={{fontSize: '12px', color: 'var(--gray-600)', marginBottom: '8px', minHeight: '32px'}}>{material.description}</p>

                      <div style={{backgroundColor: 'var(--gray-50)', borderRadius: '4px', padding: '8px', marginBottom: '12px'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px'}}>
                          <span style={{color: 'var(--gray-600)'}}>Price:</span>
                          <span style={{fontWeight: '600', color: 'var(--blue)'}}>₹{material.price}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px'}}>
                          <span style={{color: 'var(--gray-600)'}}>Quantity:</span>
                          <span style={{fontWeight: '600'}}>{material.quantity} {material.unit}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '12px'}}>
                          <span style={{color: 'var(--gray-600)'}}>Unit:</span>
                          <span style={{fontWeight: '600'}}>{material.unit}</span>
                        </div>
                      </div>

                      <button 
                        className="btn btn-outline"
                        style={{width: '100%', fontSize: '13px', padding: '6px'}}
                        onClick={() => handleEditMaterial(material)}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

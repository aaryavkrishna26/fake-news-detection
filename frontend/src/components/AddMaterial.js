import React, { useState } from 'react';
import axios from 'axios';

const AddMaterial = () => {
  const UNIT_OPTIONS = ['per bag', 'per kg', 'per ton', 'per meter', 'per sqft', 'per liter', 'per piece', 'per bundle'];
  const [form, setForm] = useState({ description: '', price: '', quantity: '', unit: 'per bag' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/materials', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Material listed successfully!');
      setForm({ description: '', price: '', quantity: '', unit: 'per bag' });
    } catch (error) {
      alert('❌ ' + (error.response?.data?.error || 'Failed to add material'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>➕ Add New Material</h2>
      
      <textarea 
        placeholder="Description (Material details, grade, specifications, etc.)" 
        value={form.description} 
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
        style={{ resize: 'vertical', fontFamily: 'inherit' }}
        required
      />
      
      <input 
        type="number" 
        placeholder="Price per Unit (₹)" 
        value={form.price} 
        onChange={(e) => setForm({ ...form, price: e.target.value })} 
        required 
      />
      
      <input 
        type="number" 
        placeholder="Quantity Available" 
        value={form.quantity} 
        onChange={(e) => setForm({ ...form, quantity: e.target.value })} 
        required 
      />
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Select Unit *</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px' }}>
          {UNIT_OPTIONS.map(unit => (
            <button
              key={unit}
              type="button"
              onClick={() => setForm({ ...form, unit })}
              style={{
                padding: '10px',
                border: form.unit === unit ? '2px solid #2ecc71' : '2px solid #ddd',
                backgroundColor: form.unit === unit ? '#d5f4e6' : '#fff',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: form.unit === unit ? '600' : '400',
                color: form.unit === unit ? '#27ae60' : '#333',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
            >
              {unit}
            </button>
          ))}
        </div>
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Listing...' : '✅ List Material'}
      </button>
    </form>
  );
};

export default AddMaterial;
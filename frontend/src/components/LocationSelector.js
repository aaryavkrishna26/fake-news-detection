import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LocationSelector = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  // Common locations - you can expand this list
  const commonLocations = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',  
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Chandigarh',
    'Indore',
    'Kochi',
    'Surat',
    'Other'
  ];

  const handleBrowse = () => {
    if (selectedLocation.trim()) {
      navigate(`/materials?location=${encodeURIComponent(selectedLocation)}`);
    } else {
      alert('Please select or enter a location');
    }
  };

  return (
    <div style={{
      backgroundColor: '#f0f9ff',
      padding: '60px 20px',
      borderRadius: '8px',
      marginTop: '30px',
      textAlign: 'center'
    }}>
      <h2 style={{ color: '#1e3a8a', marginBottom: '30px', fontSize: '28px' }}>
        🌍 Find Materials Near You
      </h2>
      
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <label style={{ display: 'block', marginBottom: '15px', fontWeight: '600', color: '#333' }}>
          📍 Select Your Location:
        </label>
        
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 15px',
            fontSize: '16px',
            border: '2px solid #2563eb',
            borderRadius: '5px',
            marginBottom: '20px',
            fontFamily: 'inherit',
            backgroundColor: '#fff'
          }}
        >
          <option value="">-- Choose a city --</option>
          {commonLocations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <div style={{ marginBottom: '15px', textAlign: 'left', fontSize: '13px', color: '#666' }}>
          <p style={{ margin: '5px 0' }}>Or enter any location:</p>
          <input
            type="text"
            placeholder="Enter your city/area"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <button
          onClick={handleBrowse}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
          onMouseHover={(e) => e.target.style.backgroundColor = '#1d4ed8'}
        >
          🔍 Search Materials & Sellers
        </button>
      </div>
    </div>
  );
};

export default LocationSelector;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const MaterialsList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const url = location 
          ? `http://localhost:5000/api/materials?location=${encodeURIComponent(location)}`
          : 'http://localhost:5000/api/materials';
        const res = await axios.get(url);
        setMaterials(res.data);
      } catch (error) {
        console.error('Error fetching materials', error);
        alert('❌ Failed to load materials');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, [location]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', fontSize: '16px' }}>⏳ Loading materials...</div>;
  }

  if (materials.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ color: '#1e3a8a', marginBottom: '15px' }}>📦 No materials available yet</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          {location 
            ? `No materials found in ${location}. Try a different location!` 
            : 'Check back soon for construction materials from local suppliers!'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginTop: '30px', fontSize: '28px', fontFamily: "'Poppins', sans-serif" }}>
        📦 Construction Materials {location && `in ${location}`}
      </h2>
      <ul>
        {materials.map((mat) => (
          <li key={mat._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <h3>🏗️ {mat.name}</h3>
                {mat.description && <p style={{ fontStyle: 'italic', color: '#888', margin: '8px 0' }}>"{mat.description}"</p>}
                <p><strong>Price:</strong> <span style={{ color: '#2563eb', fontSize: '16px', fontWeight: 'bold' }}>₹{mat.price}</span> per {mat.unit}</p>
                <p><strong>Available:</strong> {mat.quantity} {mat.unit}</p>
                <p><strong>Location:</strong> {mat.location}</p>
              </div>
              <div style={{ minWidth: '220px', backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '3px' }}>
                <h4 style={{ color: '#2563eb', marginBottom: '12px', fontSize: '13px', fontWeight: '600' }}>👨‍💼 SELLER INFO</h4>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>{mat.seller.name}</p>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>{mat.seller.location}</p>
                <button 
                  onClick={() => alert(`📞 Contact Number: ${mat.seller.phone}\n\n💬 Call or WhatsApp to inquire about ${mat.name}`)}
                  style={{ width: '100%' }}
                >
                  📞 Contact Seller
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaterialsList;
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { LocationContext } from '../context/LocationContext';
import { CartContext } from '../context/CartContext';
import ItemCard from '../components/ItemCard';
import './MaterialsList.css';

const MaterialsList = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [toast, setToast] = useState({ message: '', show: false, type: 'success' });
  const [cartItems, setCartItems] = useState({});
  const [removeConfirmId, setRemoveConfirmId] = useState(null);
  const [removingMaterial, setRemovingMaterial] = useState(null);
  const { selectedCity, selectedCategory } = useContext(LocationContext);
  const { addToCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  const city = searchParams.get('city') || selectedCity;
  const category = searchParams.get('category') || selectedCategory;

  const fetchMaterials = useCallback(async () => {
    if (!city || !category) {
      setMaterials([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/materials', {
        params: { city, category, sortBy }
      });
      setMaterials(response.data);
      setSelectedMaterials([]);
    } catch (error) {
      console.error('Error fetching materials:', error);
      setMaterials([]);
    }
    setLoading(false);
  }, [city, category, sortBy]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const toggleMaterialSelection = (materialId) => {
    setSelectedMaterials(prev => {
      if (prev.includes(materialId)) {
        return prev.filter(id => id !== materialId);
      } else if (prev.length < 3) {
        return [...prev, materialId];
      }
      return prev;
    });
  };

  const getSelectedMaterials = () => {
    return materials.filter(m => selectedMaterials.includes(m._id));
  };

  const handleCallSeller = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, show: true, type });
    setTimeout(() => setToast({ message: '', show: false, type: 'success' }), 2000);
  };

  const handleAddToCart = (material, quantity = 1) => {
    const result = addToCart(material, quantity);
    if (result.success) {
      setCartItems(prev => ({
        ...prev,
        [material._id]: true
      }));
      showToast('✅ Added to cart!', 'success');
      setTimeout(() => {
        setCartItems(prev => ({
          ...prev,
          [material._id]: false
        }));
      }, 2000);
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleRemoveMaterial = async (materialId) => {
    setRemovingMaterial(materialId);
    try {
      await axios.delete(
        `http://localhost:5000/api/materials/${materialId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMaterials(materials.filter(m => m._id !== materialId));
      setRemoveConfirmId(null);
      showToast('✅ Material removed successfully!', 'success');
    } catch (error) {
      showToast('❌ Error removing material', 'error');
      console.error('Error removing material:', error);
    } finally {
      setRemovingMaterial(null);
    }
  };

  const isSellerOfMaterial = (sellerId) => {
    return userRole === 'seller' && sellerId === userId;
  };

  return (
    <div className="materials-container">
      {/* Location Selection Banner - Show when location not selected */}
      {!selectedCity && userRole === 'buyer' && (
        <div className="location-banner">
          <div className="container">
            <div className="location-banner-content">
              <span className="location-icon">📍</span>
              <div className="location-banner-text">
                <h3>Select Your Location</h3>
                <p>Choose your city to see available materials and sellers near you</p>
              </div>
              <button 
                onClick={() => window.location.href = '/select-location'}
                className="btn btn-primary btn-small"
              >
                Select Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {removeConfirmId && (
        <div className="confirm-modal">
          <div className="confirm-modal-content">
            <h3>🗑️ Remove Listing?</h3>
            <p>Are you sure you want to remove this material listing? This action cannot be undone.</p>
            <div className="confirm-modal-actions">
              <button 
                className="confirm-btn-no"
                onClick={() => setRemoveConfirmId(null)}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn-yes"
                onClick={() => handleRemoveMaterial(removeConfirmId)}
                disabled={removingMaterial === removeConfirmId}
              >
                {removingMaterial === removeConfirmId ? '⏳ Removing...' : 'Yes, Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="materials-header">
        <h2>
          {category} Sellers in {city}
          <span className="result-count">({materials.length})</span>
        </h2>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          {selectedMaterials.length > 0 && (
            <span className="compare-badge">Comparing {selectedMaterials.length}</span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading materials...</div>
      ) : materials.length === 0 ? (
        <div className="no-results">
          <p>No sellers found for {category} in {city}</p>
          <p className="hint">Try selecting different location or category</p>
        </div>
      ) : (
        <>
          <div className="materials-grid">
            {materials.map(material => (
              <ItemCard
                key={material._id}
                item={material}
                onAddToCart={handleAddToCart}
                onCallSeller={handleCallSeller}
                onRemove={() => setRemoveConfirmId(material._id)}
                onToggleSelect={toggleMaterialSelection}
                isSelected={selectedMaterials.includes(material._id)}
                isSellerOwned={isSellerOfMaterial(material.seller?._id)}
                isInCart={cartItems[material._id]}
                userRole={userRole}
                token={token}
              />
            ))}
          </div>

          {selectedMaterials.length > 0 && (
            <div className="comparison-section">
              <h3>Comparison: {getSelectedMaterials().length} Sellers</h3>
              <div className="comparison-table">
                <table>
                  <thead>
                    <tr>
                      <th>Shop Name</th>
                      <th>Price/Unit</th>
                      <th>Min Qty</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSelectedMaterials().map(material => (
                      <tr key={material._id} className={selectedMaterials.includes(material._id) ? 'highlight' : ''}>
                        <td>{material.shopName}</td>
                        <td className="price">₹{material.price}/{material.unit}</td>
                        <td>{material.quantity} {material.unit}</td>
                        <td>
                          <a href={`tel:${material.seller?.phone}`}>{material.seller?.phone}</a>
                        </td>
                        <td>
                          <span className={`status-badge ${material.isAvailable ? 'available' : 'unavailable'}`}>
                            {material.isAvailable ? 'Available' : 'Out of Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MaterialsList;

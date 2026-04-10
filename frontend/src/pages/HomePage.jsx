import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationContext } from '../context/LocationContext';
import ProductCard from '../components/ProductCard';
import { Toast } from '../components/UIComponents';
import '../styles/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { selectedCity } = useContext(LocationContext);
  const [toast, setToast] = useState(null);
  const userRole = localStorage.getItem('userRole');

  const categories = [
    { name: 'Cement', emoji: '🏗️' },
    { name: 'Sand', emoji: '🏖️' },
    { name: 'Steel', emoji: '🔩' },
    { name: 'Bricks', emoji: '🧱' },
    { name: 'Aggregates', emoji: '🪨' },
    { name: 'All Materials', emoji: '📦' },
  ];

  // Featured products mock data
  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Cement Bag',
      category: 'Cement',
      price: 350,
      originalPrice: 400,
      discount: 12,
      rating: 4.5,
      reviews: 128,
      sellerName: 'BuildCare Delhi',
      quantity: 500,
      imageUrl: null,
    },
    {
      id: 2,
      name: 'River Sand - 50 kg',
      category: 'Sand',
      price: 200,
      rating: 4.2,
      reviews: 92,
      sellerName: 'Sand Suppliers',
      quantity: 1000,
      imageUrl: null,
    },
    {
      id: 3,
      name: 'Steel Rods TMT 12mm',
      category: 'Steel',
      price: 580,
      originalPrice: 650,
      discount: 11,
      rating: 4.7,
      reviews: 234,
      sellerName: 'Steel Mart',
      quantity: 200,
      imageUrl: null,
    },
    {
      id: 4,
      name: 'Common Bricks Bundle',
      category: 'Bricks',
      price: 2500,
      rating: 4.3,
      reviews: 156,
      sellerName: 'Local Brick Factory',
      quantity: 5000,
      imageUrl: null,
    },
    {
      id: 5,
      name: '20mm Aggregates',
      category: 'Aggregates',
      price: 350,
      rating: 4.4,
      reviews: 78,
      sellerName: 'Stone Suppliers',
      quantity: 2000,
      imageUrl: null,
    },
    {
      id: 6,
      name: 'Plaster of Paris',
      category: 'Materials',
      price: 180,
      originalPrice: 220,
      discount: 18,
      rating: 4.6,
      reviews: 203,
      sellerName: 'Materials Hub',
      quantity: 300,
      imageUrl: null,
    },
  ];

  const handleSelectLocation = () => {
    navigate('/select-location');
  };

  const handleRegisterSeller = () => {
    navigate('/register');
  };

  const handleCategoryClick = (category) => {
    if (!selectedCity) {
      navigate('/select-location');
    } else {
      navigate('/browse');
    }
  };

  const handleBrowseMaterials = () => {
    if (!selectedCity) {
      setToast({
        message: '📍 Please select a location first',
        type: 'warning',
      });
      return;
    }
    navigate('/browse');
  };

  const handleAddToCart = (product) => {
    if (!selectedCity) {
      setToast({
        message: '📍 Please select a location first',
        type: 'warning',
      });
      return;
    }
    setToast({
      message: `✅ ${product.name} added to cart!`,
      type: 'success',
    });
  };

  const handleViewDetails = (product) => {
    if (!selectedCity) {
      setToast({
        message: '📍 Please select a location first',
        type: 'warning',
      });
      return;
    }
  };

  return (
    <>
      {/* Location Selection Banner */}
      {!selectedCity && userRole === 'buyer' && (
        <div className="location-banner">
          <div className="container">
            <div className="location-banner-content">
              <span className="location-icon">📍</span>
              <div className="location-banner-text">
                <h3>Select Your Location</h3>
                <p>Choose your city to view available materials and sellers near you</p>
              </div>
              <button 
                onClick={handleSelectLocation}
                className="btn btn-primary btn-small"
              >
                Select Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">All Construction Materials in One Place</h1>
            <p className="hero-subtitle">
              Compare prices from sellers in your city. Cement, sand, steel, bricks and more.
            </p>
            <div className="hero-buttons">
              {userRole === 'buyer' ? (
                <>
                  <button
                    onClick={handleSelectLocation}
                    className="btn btn-primary hero-btn"
                  >
                    🔘 Choose Location
                  </button>
                  {selectedCity && (
                    <div className="selected-location-info">
                      <span className="location-badge">📍 Currently showing: {selectedCity}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/profile')}
                    className="btn btn-primary hero-btn"
                  >
                    Your Profile
                  </button>
                </>
              )}
            </div>
            <div className="hero-stats">
              <span>500+ Sellers</span>
              <span>•</span>
              <span>10+ Cities</span>
              <span>•</span>
              <span>Best Prices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {/* REMOVED - Replaced with Why BuildMart section */}

      {/* How It Works */}
      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2 className="section-heading">How It Works</h2>
          <div className="how-it-works-grid">
            <div className="how-it-works-card">
              <div className="how-it-works-number">1</div>
              <h3>Select Your City</h3>
              <p>Choose your location to see sellers and materials available nearby.</p>
            </div>
            <div className="how-it-works-card">
              <div className="how-it-works-number">2</div>
              <h3>Compare Prices</h3>
              <p>Browse materials from multiple sellers and find the best deals.</p>
            </div>
            <div className="how-it-works-card">
              <div className="how-it-works-number">3</div>
              <h3>Place Order</h3>
              <p>Add items to cart and checkout securely with easy payment options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why BuildMart - Local Suppliers & Benefits */}
      <section className="why-buildmart">
        <div className="container">
          {/* Top Benefits Grid */}
          <div className="benefits-section">
            <div className="benefits-grid-4">
              <div className="benefit-card-large">
                <span className="benefit-icon">📍</span>
                <h3>Local Suppliers</h3>
                <p>Access verified local suppliers offering quality construction materials.</p>
              </div>
              <div className="benefit-card-large">
                <span className="benefit-icon">✔️</span>
                <h3>Quality Assured</h3>
                <p>All products are sourced from trusted suppliers with quality certifications.</p>
              </div>
              <div className="benefit-card-large">
                <span className="benefit-icon">💰</span>
                <h3>Competitive Prices</h3>
                <p>Compare prices from multiple suppliers and get the best deals in your area.</p>
              </div>
              <div className="benefit-card-large">
                <span className="benefit-icon">🚚</span>
                <h3>Fast Delivery</h3>
                <p>Quick delivery options available from suppliers in your region.</p>
              </div>
            </div>
          </div>

          {/* We Connect Section */}
          <div className="connect-section">
            <h2 className="section-heading">We Connect Buyers & Sellers</h2>
            <div className="connect-grid">
              <div className="connect-card">
                <span className="connect-icon">⭐</span>
                <h3>Trusted Platform</h3>
                <p>A reliable marketplace where buyers and sellers can transact with confidence.</p>
              </div>
              <div className="connect-card">
                <span className="connect-icon">🔒</span>
                <h3>Safe & Secure</h3>
                <p>Your transactions and personal information are protected with industry-standard security.</p>
              </div>
              <div className="connect-card">
                <span className="connect-icon">🤝</span>
                <h3>Quick Assistance</h3>
                <p>Get instant support from our team whenever you need help or have questions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>BuildMart © 2024 — Find Construction Materials Near You</p>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default HomePage;

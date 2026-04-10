import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LocationContext } from '../context/LocationContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { selectedCity, setCity } = useContext(LocationContext);
  const { getCartCount } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  const CITIES = ['Mumbai', 'Delhi', 'Lucknow', 'Jaipur', 'Indore'];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const handleCitySelect = (city) => {
    setCity(city);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-wrapper">
          {/* LEFT: Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-text">
              <span className="logo-build">Build</span>
              <span className="logo-mart">Mart</span>
            </span>
          </Link>

          {/* CENTER: Nav Links (Hidden on mobile) */}
          <div className="navbar-links hide-mobile">
            <a href="/#how-it-works" className="nav-link">
              Browse
            </a>
            <a href="/#how-it-works" className="nav-link">
              How It Works
            </a>
          </div>

          {/* RIGHT: Auth / User Menu */}
          <div className="navbar-right hide-mobile">
            {!token ? (
              <div className="nav-auth">
                {/* Location Selector for non-authenticated users */}
                <select 
                  className="nav-location-select"
                  value={selectedCity || ''}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-small">
                  Register
                </Link>
              </div>
            ) : (
              <div className="nav-user">
                {userRole === 'buyer' && (
                  <button
                    className="btn btn-location"
                    onClick={() => navigate('/select-location')}
                    title="Change Location"
                  >
                    📍 Choose Different Location
                  </button>
                )}

                {userRole === 'buyer' && (
                  <button
                    className="nav-cart-btn"
                    onClick={() => navigate('/cart')}
                    title="Cart"
                  >
                    🛒
                    {getCartCount() > 0 && (
                      <span className="cart-count">{getCartCount()}</span>
                    )}
                  </button>
                )}

                {userRole === 'seller' && (
                  <Link to="/seller/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                )}

                <Link to="/profile" className="nav-link profile-link" title="My Profile">
                  👤
                </Link>

                <div className="nav-user-actions">
                  <span className="nav-username">{userName}</span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-logout"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <button
            className="hamburger show-mobile"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="navbar-dropdown">
            <a href="/#how-it-works" className="dropdown-link">
              Browse
            </a>
            <a href="/#how-it-works" className="dropdown-link">
              How It Works
            </a>

            {!token ? (
              <>
                {/* Location Selector for mobile */}
                <select 
                  className="dropdown-location-select"
                  value={selectedCity || ''}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Select Location</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                
                <Link to="/login" className="dropdown-link">
                  Login
                </Link>
                <Link to="/register" className="dropdown-link">
                  Register
                </Link>
              </>
            ) : (
              <>
                {userRole === 'buyer' && (
                  <button 
                    className="dropdown-link"
                    onClick={() => { navigate('/select-location'); setIsMenuOpen(false); }}
                  >
                    📍 Choose Different Location
                  </button>
                )}

                {userRole === 'buyer' && (
                  <Link to="/cart" className="dropdown-link">
                    Cart ({getCartCount()})
                  </Link>
                )}

                {userRole === 'seller' && (
                  <Link to="/seller/dashboard" className="dropdown-link">
                    My Dashboard
                  </Link>
                )}

                {userRole === 'seller' && (
                  <Link to="/add-material" className="dropdown-link">
                    Add Material
                  </Link>
                )}

                <Link to="/profile" className="dropdown-link">
                  👤 My Profile
                </Link>

                <div className="dropdown-item user-info">{userName}</div>

                <button
                  onClick={handleLogout}
                  className="dropdown-link logout"
                >
                  Logout
                </button>
              </>
            )}

            {selectedCity && userRole === 'buyer' && (
              <div className="dropdown-city-selector">
                <div className="dropdown-label">Change city:</div>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`dropdown-city-option ${
                      city === selectedCity ? 'active' : ''
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

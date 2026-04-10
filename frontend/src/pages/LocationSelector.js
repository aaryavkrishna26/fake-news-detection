import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationContext } from '../context/LocationContext';
import './LocationSelector.css';

const LocationSelector = () => {
  const { setCity } = useContext(LocationContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const INDIAN_CITIES = [
    'Ahmedabad', 'Bangalore', 'Bhopal', 'Chandigarh', 'Chennai', 'Coimbatore',
    'Delhi', 'Gurgaon', 'Hyderabad', 'Indore', 'Jabalpur', 'Jaipur', 'Jodhpur',
    'Kanpur', 'Kochi', 'Kolkata', 'Lucknow', 'Ludhiana', 'Mumbai', 'Nagpur',
    'Nashik', 'Noida', 'Patna', 'Pune', 'Raipur', 'Ranchi', 'Sagar', 'Salem',
    'Srinagar', 'Surat', 'Thiruvananthapuram', 'Thane', 'Udaipur', 'Ujjain',
    'Varanasi', 'Vadodara', 'Visakhapatnam', 'Yamunanagar', 'Agra', 'Amritsar',
    'Aurangabad', 'Bareilly', 'Belgaum', 'Aligarh', 'Allahabad', 'Asansol',
    'Ayodhya', 'Bhilwara', 'Bikaner', 'Meerut'
  ];

  const filteredCities = INDIAN_CITIES.filter(city =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city) => {
    setCity(city);
    navigate('/categories');
  };

  return (
    <div className="location-selector">
      <div className="location-hero">
        <h1>Select Your Location</h1>
        <p>Find quality construction materials from verified suppliers in your area</p>
      </div>

      <div className="location-content">
        {/* Search Section */}
        <div className="search-section">
          <div className="search-box-wrapper">
            <label className="search-label">Search City</label>
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Enter city name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
              />
            </div>

            {showDropdown && (
              <div className="city-dropdown">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city, index) => (
                    <div
                      key={index}
                      className="city-item"
                      onClick={() => {
                        handleSelect(city);
                        setShowDropdown(false);
                        setSearch('');
                      }}
                    >
                      {city}
                    </div>
                  ))
                ) : (
                  <div className="city-item disabled">
                    No cities found
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="popular-cities">
            <label className="popular-label">Popular Cities</label>
            <div className="cities-grid">
              {['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Chennai', 'Kolkata', 'Jaipur'].map(
                (city) => (
                  <button
                    key={city}
                    className="city-btn"
                    onClick={() => handleSelect(city)}
                  >
                    {city}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LocationContext } from '../context/LocationContext';
import '../styles/MaterialCategorySelector.css';

const MaterialCategorySelector = () => {
  const { selectedCity, setCategory } = useContext(LocationContext);
  const navigate = useNavigate();

  const CATEGORIES = [
    { name: 'Cement', emoji: '🏗️' },
    { name: 'Sand', emoji: '🏜️' },
    { name: 'Steel/TMT Bars', emoji: '⚙️' },
    { name: 'Bricks', emoji: '🧱' },
    { name: 'Aggregates', emoji: '💠' },
    { name: 'Paint', emoji: '🎨' },
    { name: 'Tiles', emoji: '⬜' },
    { name: 'Pipes', emoji: '🔴' },
    { name: 'Electrical', emoji: '⚡' },
    { name: 'Wood/Timber', emoji: '🪵' },
  ];

  if (!selectedCity) {
    return (
      <div className="material-category-selector">
        <div className="error-message">
          <p>Please select a city first</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  const handleCategorySelect = (categoryName) => {
    setCategory(categoryName);
    navigate(`/browse?city=${selectedCity}&category=${categoryName}`);
  };

  return (
    <div className="material-category-selector">
      <div className="category-hero">
        <h1>Select Material Category</h1>
        <p>Browsing materials in: <strong>{selectedCity}</strong></p>
      </div>

      <div className="category-content">
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              className="category-card"
              onClick={() => handleCategorySelect(cat.name)}
            >
              <div className="category-icon">{cat.emoji}</div>
              <h3 className="category-name">{cat.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <button className="back-button" onClick={() => navigate('/')}>
        ← Change Location
      </button>
    </div>
  );
};

export default MaterialCategorySelector;

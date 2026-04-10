import React, { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('selectedCity') || null;
  });
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return localStorage.getItem('selectedCategory') || null;
  });

  useEffect(() => {
    if (selectedCity) {
      localStorage.setItem('selectedCity', selectedCity);
    } else {
      localStorage.removeItem('selectedCity');
    }
  }, [selectedCity]);

  useEffect(() => {
    if (selectedCategory) {
      localStorage.setItem('selectedCategory', selectedCategory);
    } else {
      localStorage.removeItem('selectedCategory');
    }
  }, [selectedCategory]);

  const setCity = (city) => {
    setSelectedCity(city);
    // Clear category when city changes
    setSelectedCategory(null);
  };

  const setCategory = (category) => {
    setSelectedCategory(category);
  };

  const clearLocation = () => {
    setSelectedCity(null);
    setSelectedCategory(null);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        selectedCategory,
        setCity,
        setCategory,
        clearLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

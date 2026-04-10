import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('buildmart_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('buildmart_cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('buildmart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((material, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === material._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === material._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...material, quantity }];
    });
    return { success: true, message: '✅ Added to cart!' };
  }, []);

  const removeFromCart = useCallback((materialId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== materialId));
  }, []);

  const updateQuantity = useCallback((materialId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(materialId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item._id === materialId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('buildmart_cart');
  }, []);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const applyCoupon = async (couponCode) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/coupons/apply',
        { couponCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { success: true, message: response.data.message, discount: response.data.discount };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.error || 'Error applying coupon' 
      };
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartCount,
      getCartTotal,
      applyCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

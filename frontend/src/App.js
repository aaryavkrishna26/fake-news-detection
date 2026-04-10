import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LocationSelector from './pages/LocationSelector';
import MaterialCategorySelector from './pages/MaterialCategorySelector';
import MaterialsList from './pages/MaterialsList';
import AddMaterial from './pages/AddMaterial';
import Login from './components/Login';
import Register from './components/Register';
import SellerDashboard from './pages/SellerDashboard';
import SellerShop from './components/SellerShop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import BuyerDashboard from './pages/BuyerDashboard';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderSuccess from './pages/OrderSuccess';
import PersonalDashboard from './pages/PersonalDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const ProtectedRoute = ({ children, requiredRole = null }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      return <Navigate to="/login" />;
    }
    
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <Router>
      <LocationProvider>
        <CartProvider>
          <div className="App">
            {/* Show Navbar for authenticated users */}
            {localStorage.getItem('token') && <Navbar />}

            <Routes>
              {/* Login Route */}
              <Route path="/login" element={<Login setUser={setUser} />} />
              
              {/* Register Route */}
              <Route path="/register" element={<Register setUser={setUser} />} />
              
              {/* Home Page - Protected */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              
              {/* City Selection */}
              <Route path="/select-location" element={<LocationSelector />} />
              
              {/* Seller Dashboard */}
              <Route 
                path="/seller/dashboard" 
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Seller Shop Profile */}
              <Route 
                path="/my-shop" 
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerShop />
                  </ProtectedRoute>
                } 
              />
              
              {/* Category Selection */}
              <Route path="/categories" element={<MaterialCategorySelector />} />
              
              {/* Browse Materials */}
              <Route path="/browse" element={<MaterialsList />} />
              
              {/* Add Material (Seller Only) */}
              <Route 
                path="/sell" 
                element={
                  <ProtectedRoute requiredRole="seller">
                    <AddMaterial />
                  </ProtectedRoute>
                } 
              />

              {/* Cart */}
              <Route path="/cart" element={<Cart />} />

              {/* Checkout */}
              <Route path="/checkout" element={<Checkout />} />

              {/* Buyer Dashboard */}
              <Route path="/dashboard" element={<BuyerDashboard />} />

              {/* Personal Profile Dashboard */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <PersonalDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Order Confirmation */}
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

              {/* Order Success */}
              <Route path="/order-success/:orderId" element={<OrderSuccess />} />
              
              {/* Catch all - redirect based on auth status */}
              <Route path="*" element={<Navigate to={localStorage.getItem('token') ? "/" : "/login"} />} />
            </Routes>
          </div>
        </CartProvider>
      </LocationProvider>
    </Router>
  );
}

export default App;

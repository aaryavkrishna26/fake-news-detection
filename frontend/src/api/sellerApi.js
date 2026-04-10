import axios from 'axios';

const BASE = 'http://localhost:5000/api/seller';

const getToken = () => localStorage.getItem('token');
const headers = () => ({ Authorization: `Bearer ${getToken()}` });

export const getSellerProfile = () => 
  axios.get(`${BASE}/profile`, { headers: headers() });

export const updateSellerProfile = (data) => 
  axios.put(`${BASE}/profile`, data, { headers: headers() });

export const getSellerOrders = () => 
  axios.get(`${BASE}/orders`, { headers: headers() });

export const updateOrderStatus = (orderId, status) =>
  axios.put(`${BASE}/orders/${orderId}/status`, { status }, { headers: headers() });

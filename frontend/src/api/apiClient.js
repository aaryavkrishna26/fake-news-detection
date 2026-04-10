import axios from 'axios';

// For Vercel deployment, API calls to /api will be routed to the backend
// For local development, set REACT_APP_API_URL=http://localhost:5000
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : '/api');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

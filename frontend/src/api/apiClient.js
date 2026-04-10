import axios from 'axios';

// API Base URL configuration
const getBaseURL = () => {
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  if (isLocalhost) {
    return 'http://localhost:5000';
  }
  // Production - use Railway backend
  return 'https://build-mart-production-a9e7.up.railway.app';
};

const API_URL = getBaseURL();

console.log('API Base URL:', API_URL);
console.log('Environment:', process.env.NODE_ENV);

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API Request:', config.method?.toUpperCase(), `${API_URL}${config.url}`);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_URL };
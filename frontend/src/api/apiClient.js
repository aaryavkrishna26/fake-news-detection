import axios from 'axios';

// API Base URL configuration
const getBaseURL = () => {
  // Priority 1: Explicit environment variable (for custom deployments)
  if (process.env.REACT_APP_API_URL) {
    console.log('Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }

  // Priority 2: Check if running on localhost (development)
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  if (isLocalhost) {
    console.log('Detected localhost - using development backend');
    return 'http://localhost:5000';
  }

  // Priority 3: Production deployment - use Railway backend
  // This is the default for Vercel/production deployments
  const productionURL = 'https://build-mart-production-a9e7.up.railway.app';
  console.log('Using production Railway backend:', productionURL);
  return productionURL;
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
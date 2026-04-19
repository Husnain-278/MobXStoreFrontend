import axios from 'axios';
import store from '../store/index';
import { logoutUser } from '../store/slices/authSlice';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
      window.location.href = '/login';
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    // Handle 500 - Server error
    if (error.response?.status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

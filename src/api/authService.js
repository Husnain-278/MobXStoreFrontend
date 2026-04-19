import axiosInstance from './axiosInstance';

// Register new user
export const register = async (email, password) => {
  return axiosInstance.post('/accounts/register/', { email, password });
};

// Login user
export const login = async (email, password) => {
  return axiosInstance.post('/accounts/login/', { email, password });
};

// Verify email
export const verifyEmail = async (uidb64, token) => {
  return axiosInstance.get(`/accounts/verify-email/${uidb64}/${token}/`);
};

// Get user profile
export const getProfile = async () => {
  return axiosInstance.get('/accounts/profile/');
};

// Logout is handled on frontend only (just clear localStorage and Redux state)
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

import { useDispatch, useSelector } from 'react-redux';
import {
  registerUser,
  loginUser,
  verifyEmail,
  getProfile,
  logoutUser,
  clearError,
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  return {
    user: auth.user,
    token: auth.token,
    isLoading: auth.isLoading,
    error: auth.error,
    isVerificationPending: auth.isVerificationPending,
    registrationSuccess: auth.registrationSuccess,
    register: (email, password) => dispatch(registerUser({ email, password })),
    login: (email, password) => dispatch(loginUser({ email, password })),
    verifyEmail: (uidb64, token) => dispatch(verifyEmail({ uidb64, token })),
    getProfile: () => dispatch(getProfile()),
    logout: () => dispatch(logoutUser()),
    clearError: () => dispatch(clearError()),
  };
};

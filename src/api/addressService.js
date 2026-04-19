import axiosInstance from './axiosInstance';

// Get user's addresses
export const getAddresses = async () => {
  return axiosInstance.get('/addresses/');
};

// Create new address
export const createAddress = async (addressData) => {
  return axiosInstance.post('/addresses/', addressData);
};

// Delete address
export const deleteAddress = async (addressId) => {
  return axiosInstance.delete(`/addresses/delete/${addressId}/`);
};

// Set address as default
export const setDefaultAddress = async (addressId) => {
  return axiosInstance.post(`/addresses/set-default/${addressId}/`);
};

import axiosInstance from './axiosInstance';

// Create order from cart
export const createOrder = async (paymentMethod, addressId) => {
  return axiosInstance.post('/cart/order/', {
    payment_method: paymentMethod,
    address_id: addressId,
  });
};

// Get user's orders
export const getUserOrders = async (page = 1) => {
  return axiosInstance.get(`/cart/orders/?page=${page}`);
};

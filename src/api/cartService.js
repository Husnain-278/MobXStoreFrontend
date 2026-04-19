import axiosInstance from './axiosInstance';

// Get user's current cart
export const getCart = async () => {
  return axiosInstance.get('/cart/');
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  return axiosInstance.post('/cart/add-to-cart/', {
    product_id: productId,
    quantity,
  });
};

// Update cart quantity
export const updateQuantity = async (action) => {
  return axiosInstance.patch('/cart/update/', {
    action,
  });
};

// Remove entire cart
export const removeCart = async () => {
  return axiosInstance.delete('/cart/remove/');
};

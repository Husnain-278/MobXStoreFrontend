import axiosInstance from './axiosInstance';

// Get user's wishlist
export const getWishlist = async (page = 1) => {
  return axiosInstance.get(`/wishlist/?page=${page}`);
};

// Add product to wishlist
export const addToWishlist = async (productId) => {
  return axiosInstance.post('/wishlist/add/', {
    product: productId,
  });
};

// Remove product from wishlist
export const removeFromWishlist = async (wishlistId) => {
  return axiosInstance.delete(`/wishlist/remove/${wishlistId}/`);
};

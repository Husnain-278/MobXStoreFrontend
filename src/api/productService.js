import axiosInstance from './axiosInstance';

// Get all products with filters
export const getProducts = async ({ page = 1, page_size = '', search = '', category = '', brand = '', min_price = '', max_price = '' } = {}) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page);
  if (page_size) params.append('page_size', page_size);
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  if (brand) params.append('brand', brand);
  if (min_price) params.append('min_price', min_price);
  if (max_price) params.append('max_price', max_price);

  return axiosInstance.get(`/products/mobiles/?${params.toString()}`);
};

// Get single product detail by slug
export const getProductDetail = async (slug) => {
  return axiosInstance.get(`/products/mobiles/${slug}/`);
};

// Get all categories
export const getCategories = async () => {
  return axiosInstance.get('/products/categories/');
};

// Get all brands
export const getBrands = async () => {
  return axiosInstance.get('/products/brands/');
};

// Add review to product
export const addReview = async (productId, rating, comment) => {
  return axiosInstance.post('/products/add-review/', {
    product_id: productId,
    rating,
    comment: comment || '',
  });
};

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  fetchProductDetail,
  fetchCategories,
  fetchBrands,
  addReview,
  setFilters,
  setPage,
  clearError,
  clearCurrentProduct,
} from '../store/slices/productsSlice';

export const useProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);

  return {
    items: products.products,
    currentProduct: products.currentProduct,
    categories: products.categories,
    brands: products.brands,
    filters: products.filters,
    totalCount: products.totalCount,
    pageSize: products.pageSize,
    isLoading: products.isLoading,
    error: products.error,
    fetch: (filters) => dispatch(fetchProducts(filters)),
    fetchDetail: (slug) => dispatch(fetchProductDetail(slug)),
    fetchCategories: () => dispatch(fetchCategories()),
    fetchBrands: () => dispatch(fetchBrands()),
    addReview: (productId, rating, comment) => dispatch(addReview({ productId, rating, comment })),
    setFilters: (filters) => dispatch(setFilters(filters)),
    setPage: (page) => dispatch(setPage(page)),
    clearError: () => dispatch(clearError()),
    clearCurrentProduct: () => dispatch(clearCurrentProduct()),
  };
};

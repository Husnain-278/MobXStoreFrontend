import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  clearError,
} from '../store/slices/wishlistSlice';

export const useWishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);

  return {
    items: wishlist.items,
    totalCount: wishlist.totalCount,
    pageSize: wishlist.pageSize,
    isLoading: wishlist.isLoading,
    error: wishlist.error,
    fetch: (page) => dispatch(fetchWishlist({ page })),
    addToWishlist: (productId) => dispatch(addToWishlist(productId)),
    removeFromWishlist: (wishlistId) => dispatch(removeFromWishlist(wishlistId)),
    isInWishlist: (productId) => wishlist.items.some((item) => item.product === productId),
    clearError: () => dispatch(clearError()),
  };
};

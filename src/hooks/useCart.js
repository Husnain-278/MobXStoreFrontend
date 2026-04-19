import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearError,
} from '../store/slices/cartSlice';

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const cartQuantity = Number(cart.item?.quantity ?? 0);

  return {
    item: cart.item,
    isLoading: cart.isLoading,
    error: cart.error,
    cartCount: Number.isNaN(cartQuantity) ? 0 : Math.max(cartQuantity, 0),
    totalPrice: cart.item ? cart.item.total_price : 0,
    fetch: () => dispatch(fetchCart()),
    addToCart: (productId, quantity = 1) => dispatch(addToCart({ productId, quantity })),
    updateQuantity: (action) => dispatch(updateCartQuantity(action)),
    remove: () => dispatch(removeFromCart()),
    clearError: () => dispatch(clearError()),
  };
};

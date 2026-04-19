import { useDispatch, useSelector } from 'react-redux';
import {
  createOrder,
  fetchUserOrders,
  clearError,
  setCurrentOrder,
} from '../store/slices/ordersSlice';

export const useOrders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);

  return {
    orders: orders.orders,
    currentOrder: orders.currentOrder,
    totalCount: orders.totalCount,
    pageSize: orders.pageSize,
    isLoading: orders.isLoading,
    error: orders.error,
    create: (paymentMethod, addressId) => dispatch(createOrder({ paymentMethod, addressId })),
    fetchUserOrders: (page) => dispatch(fetchUserOrders({ page })),
    setCurrentOrder: (order) => dispatch(setCurrentOrder(order)),
    clearError: () => dispatch(clearError()),
  };
};

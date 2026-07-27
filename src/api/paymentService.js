import axiosInstance from './axiosInstance';
import { API_ENDPOINTS } from '../utils/constants';

export const createPayPalOrder = async (addressId) => {
  return axiosInstance.post(API_ENDPOINTS.PAYMENTS.CREATE_ORDER, {
    address_id: addressId,
  });
};

export const capturePayPalOrder = async (paypalOrderId, addressId) => {
  return axiosInstance.post(API_ENDPOINTS.PAYMENTS.CAPTURE_ORDER, {
    paypal_order_id: paypalOrderId,
    address_id: addressId,
  });
};
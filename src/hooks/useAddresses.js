import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAddresses,
  createAddress,
  deleteAddress,
  setDefaultAddress,
  clearError,
} from '../store/slices/addressSlice';

export const useAddresses = () => {
  const dispatch = useDispatch();
  const address = useSelector((state) => state.address);

  return {
    addresses: address.addresses,
    isLoading: address.isLoading,
    error: address.error,
    fetch: () => dispatch(fetchAddresses()),
    create: (addressData) => dispatch(createAddress(addressData)),
    delete: (addressId) => dispatch(deleteAddress(addressId)),
    setDefault: (addressId) => dispatch(setDefaultAddress(addressId)),
    getDefaultAddress: () => address.addresses.find((addr) => addr.is_default),
    clearError: () => dispatch(clearError()),
  };
};

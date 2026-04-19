import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as addressService from '../../api/addressService';

// Async thunks
export const fetchAddresses = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressService.getAddresses();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch addresses');
    }
  }
);

export const createAddress = createAsyncThunk(
  'address/createAddress',
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await addressService.createAddress(addressData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await addressService.deleteAddress(addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete address');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await addressService.setDefaultAddress(addressId);
      return addressId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to set default address');
    }
  }
);

// Initial state
const initialState = {
  addresses: [],
  isLoading: false,
  error: null,
};

// Address slice
const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Addresses
    builder.addCase(fetchAddresses.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAddresses.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addresses = Array.isArray(action.payload) ? action.payload : action.payload.results || [];
    });
    builder.addCase(fetchAddresses.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Create Address
    builder.addCase(createAddress.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addresses.push(action.payload);
    });
    builder.addCase(createAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Delete Address
    builder.addCase(deleteAddress.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addresses = state.addresses.filter((addr) => addr.id !== action.payload);
    });
    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Set Default Address
    builder.addCase(setDefaultAddress.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(setDefaultAddress.fulfilled, (state, action) => {
      state.isLoading = false;
      state.addresses = state.addresses.map((addr) => ({
        ...addr,
        is_default: addr.id === action.payload,
      }));
    });
    builder.addCase(setDefaultAddress.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = addressSlice.actions;
export default addressSlice.reducer;

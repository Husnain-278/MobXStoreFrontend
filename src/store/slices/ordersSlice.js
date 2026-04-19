import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as orderService from '../../api/orderService';

const normalizeOrdersResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results?.data)) {
    return payload.results.data;
  }

  if (Array.isArray(payload?.data?.results)) {
    return payload.data.results;
  }

  return [];
};

// Async thunks
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ paymentMethod, addressId }, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(paymentMethod, addressId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await orderService.getUserOrders(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  totalCount: 0,
  pageSize: 10,
  isLoading: false,
  error: null,
};

// Orders slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentOrder = action.payload.data || action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch User Orders
    builder.addCase(fetchUserOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = normalizeOrdersResponse(action.payload);
      state.totalCount = action.payload.count || 0;
    });
    builder.addCase(fetchUserOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError, setCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

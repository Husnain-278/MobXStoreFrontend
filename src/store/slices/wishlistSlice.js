import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistService from '../../api/wishlistService';

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async ({ page = 1 } = {}, { rejectWithValue }) => {
    try {
      const response = await wishlistService.getWishlist(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await wishlistService.addToWishlist(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (wishlistId, { rejectWithValue }) => {
    try {
      await wishlistService.removeFromWishlist(wishlistId);
      return wishlistId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove from wishlist');
    }
  }
);

// Initial state
const initialState = {
  items: [],
  totalCount: 0,
  pageSize: 10,
  isLoading: false,
  error: null,
};

// Wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder.addCase(fetchWishlist.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.results || action.payload;
      state.totalCount = action.payload.count || 0;
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Add to Wishlist
    builder.addCase(addToWishlist.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.isLoading = false;
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Remove from Wishlist
    builder.addCase(removeFromWishlist.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = state.items.filter((item) => item.id !== action.payload);
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;

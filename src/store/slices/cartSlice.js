import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as cartService from '../../api/cartService';

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { getState, rejectWithValue }) => {
    try {
      const existingItem = getState().cart.item;
      const existingProductId =
        existingItem?.product ?? existingItem?.product_id ?? existingItem?.productId ?? null;

      if (
        existingItem &&
        existingProductId !== null &&
        Number(existingProductId) !== Number(productId)
      ) {
        return rejectWithValue({
          message: 'Cart already has a product. Remove it first.',
        });
      }

      const response = await cartService.addToCart(productId, quantity);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add to cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (action, { rejectWithValue }) => {
    try {
      const response = await cartService.updateQuantity(action);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update quantity');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeCart',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.removeCart();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to remove cart');
    }
  }
);

// Initial state
const initialState = {
  item: null,
  isLoading: false,
  error: null,
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.item = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Add to Cart
    builder.addCase(addToCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.item = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update Quantity
    builder.addCase(updateCartQuantity.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCartQuantity.fulfilled, (state, action) => {
      state.isLoading = false;
      state.item = action.payload;
    });
    builder.addCase(updateCartQuantity.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Remove from Cart
    builder.addCase(removeFromCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state) => {
      state.isLoading = false;
      state.item = null;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = cartSlice.actions;
export default cartSlice.reducer;

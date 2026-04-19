import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productService from '../../api/productService';

const normalizeArrayResponse = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.results?.data)) {
    return payload.results.data;
  }

  if (Array.isArray(payload?.data?.results)) {
    return payload.data.results;
  }

  return [];
};

const normalizeObjectResponse = (payload) => {
  if (payload?.data && !Array.isArray(payload.data)) {
    return payload.data;
  }

  return payload;
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, search = '', category = '', brand = '', min_price = '', max_price = '' } = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts({
        page,
        search,
        category,
        brand,
        min_price,
        max_price,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetail = createAsyncThunk(
  'products/fetchProductDetail',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await productService.getProductDetail(slug);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch product');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const fetchBrands = createAsyncThunk(
  'products/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getBrands();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch brands');
    }
  }
);

export const addReview = createAsyncThunk(
  'products/addReview',
  async ({ productId, rating, comment }, { rejectWithValue }) => {
    try {
      const response = await productService.addReview(productId, rating, comment);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add review');
    }
  }
);

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  categories: [],
  brands: [],
  filters: {
    page: 1,
    search: '',
    category: '',
    brand: '',
    min_price: '',
    max_price: '',
  },
  totalCount: 0,
  pageSize: 10,
  isLoading: false,
  error: null,
};

// Products slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = normalizeArrayResponse(action.payload);
      state.totalCount = action.payload.count || 0;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch Product Detail
    builder.addCase(fetchProductDetail.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProductDetail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentProduct = normalizeObjectResponse(action.payload);
    });
    builder.addCase(fetchProductDetail.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch Categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.isLoading = false;
      state.categories = normalizeArrayResponse(action.payload);
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Fetch Brands
    builder.addCase(fetchBrands.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchBrands.fulfilled, (state, action) => {
      state.isLoading = false;
      state.brands = normalizeArrayResponse(action.payload);
    });
    builder.addCase(fetchBrands.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Add Review
    builder.addCase(addReview.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addReview.fulfilled, (state, action) => {
      state.isLoading = false;
      if (state.currentProduct) {
        state.currentProduct.reviews = [action.payload, ...(state.currentProduct.reviews || [])].slice(0, 5);
        state.currentProduct.total_reviews = (state.currentProduct.total_reviews || 0) + 1;
      }
    });
    builder.addCase(addReview.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { setFilters, setPage, clearError, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;

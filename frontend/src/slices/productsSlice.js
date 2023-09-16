import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk action to fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const { data } = await axios.get('/api/products');
    return data;
  }
);

// Async thunk action to fetch individual product
export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (productId) => {
    const { data } = await axios.get(`/api/products/${productId}`);
    return data;
  }
);

// Initial state
const initialState = {
  products: [],
  product: null,
  productsStatus: 'idle', // for all products
  productStatus: 'idle', // for individual product
  error: null,
};

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Products
      .addCase(fetchProducts.pending, (state) => {
        state.productsStatus = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.productsStatus = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.productsStatus = 'failed';
        state.error = action.error.message;
      })
      // Fetch Product Details
      .addCase(fetchProduct.pending, (state) => {
        state.productStatus = 'loading';
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.productStatus = 'succeeded';
        state.product = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.productStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export actions if needed
// export const {} = productsSlice.actions;

// Export reducer
export default productsSlice.reducer;

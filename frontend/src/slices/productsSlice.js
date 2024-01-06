import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PRODUCTS_URL } from '../constants';


// Async thunk action to fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ pageNumber = 1, keyword = '' }) => {
    const { data } = await axios.get(`${PRODUCTS_URL}?pageNumber=${pageNumber}&keyword=${keyword}`);
    return data;
  }
);

// Async thunk action to create a new product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (newProduct, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${PRODUCTS_URL}`, newProduct);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)


// Async thunk action to delete a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${PRODUCTS_URL}/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

// Async thunk action to fetch top rated products
export const fetchTopRatedProducts = createAsyncThunk(
  'products/fetchTopRatedProducts',
  async () => {
    const { data } = await axios.get(`${PRODUCTS_URL}/top`); // sending a get request to the endpoint for top rated products
    return data;
  }
);


// Async thunk action to fetch individual product
export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (productId, { rejectWithValue }) => { // Notice the added { rejectWithValue }
    try {
      const { data } = await axios.get(`${PRODUCTS_URL}/${productId}`);
      return data;
    } catch (error) {
      // Extract the error message and reject the thunk with it.
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk action to update a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updatedProduct }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${PRODUCTS_URL}/${id}`, updatedProduct);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk action to remove images from a product
export const removeProductImages = createAsyncThunk(
  'products/removeProductImages',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${PRODUCTS_URL}/${productId}/images`);
      return response.data; // Assuming the backend returns some data on success
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Initial state
const initialState = {
  data: {
    products: [],
    page: null,
    pages: null,
  },
  product: null,
  productsStatus: 'idle', // for all products
  productStatus: 'idle', // for individual product
  removeImagesStatus: 'idle',
  createdProductStatus: 'idle',
  deletedProductStatus: 'idle',
  error: null,
  reviewError: null,
  topRatedProducts: [],
  topRatedProductsStatus: 'idle',
  topRatedError: null,
  updatedProductStatus: 'idle',
  updateError: null,
  removeImagesError: null,
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
        state.data = action.payload;
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
        state.error = action.payload.message;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.createdProductStatus = 'loading';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createdProductStatus = 'succeeded';
        state.data.products = [...state.data.products, action.payload];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createdProductStatus = 'failed';
        state.error = action.error.message;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.deletedProductStatus = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deletedProductStatus = 'succeeded';
        state.data.products = state.data.products.filter(product => product._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deletedProductStatus = 'failed';
        state.error = action.error.message;
      })
      // Fetch Top Rated Products
      .addCase(fetchTopRatedProducts.pending, (state) => {
        state.topRatedProductsStatus = 'loading';
      })
      .addCase(fetchTopRatedProducts.fulfilled, (state, action) => {
        state.topRatedProductsStatus = 'succeeded';
        state.topRatedProducts = action.payload;
      })
      .addCase(fetchTopRatedProducts.rejected, (state, action) => {
        state.topRatedProductsStatus = 'failed';
        state.topRatedError = action.error.message;
      })
      .addCase(updateProduct.pending, (state) => {
        state.updatedProductStatus = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updatedProductStatus = 'succeeded';
        const index = state.data.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.data.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updatedProductStatus = 'failed';
        state.updateError = action.error.message;
      })
      .addCase(removeProductImages.pending, (state) => {
        // Handle loading state if needed
        state.removeImagesStatus = 'loading'
        state.removeImagesError = null
      })
      .addCase(removeProductImages.fulfilled, (state, action) => {
        // Assuming the payload contains the updated product data without images
        state.removeImagesStatus = 'succeeded'
        state.product.images = []
        state.removeImagesError = null
      })
      .addCase(removeProductImages.rejected, (state, action) => {
        // Handle error
        state.removeImagesError = action.error.message;
      });
      
  },
});


// Export reducer
export default productsSlice.reducer;

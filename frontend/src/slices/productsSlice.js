import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk action to fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ pageNumber = 1, keyword = '' }) => {
    const { data } = await axios.get(`/api/products?pageNumber=${pageNumber}&keyword=${keyword}`);
    return data;
  }
);

// Async thunk action to create a new product
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (newProduct, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/products', newProduct);
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
      await axios.delete(`/api/products/${productId}`);
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
    const { data } = await axios.get('/api/products/top'); // sending a get request to the endpoint for top rated products
    return data;
  }
);

// Async thunk action to update a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ productId, updatedFields }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `/api/products/${productId}`,
        updatedFields,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );
      return { updatedFields: data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
)

// Async thunk action to fetch individual product
export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (productId, { rejectWithValue }) => { // Notice the added { rejectWithValue }
    try {
      const { data } = await axios.get(`/api/products/${productId}`);
      return data;
    } catch (error) {
      // Extract the error message and reject the thunk with it.
      return rejectWithValue(error.response.data);
    }
  }
);

// Add an asynchronous thunk for deleting product images.
export const deleteProductImages = createAsyncThunk(
  'products/deleteProductImagesStatus',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/${productId}/images`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
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
  updatedProduct: null,
  productsStatus: 'idle', // for all products
  productStatus: 'idle', // for individual product
  createdProductStatus: 'idle',
  updatedProductStatus: 'idle',
  deletedProductStatus: 'idle',
  error: null,
  updateError: null,
  reviewError: null,
  createdReviewStatus: 'idle',
  topRatedProducts: [],
  topRatedProductsStatus: 'idle',
  topRatedError: null,
  deleteImagesStatus: 'idle',
  deleteImagesError: null,
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
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.updatedProductStatus = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updatedProductStatus = 'succeeded';
        const index = state.data.products.findIndex(product => product._id === action.payload.updatedFields._id);
        if (index !== -1) {
          state.data.products[index] = action.payload.updatedFields;
        }
      })

      .addCase(updateProduct.rejected, (state, action) => {
        state.updatedProductStatus = 'failed';
        state.updateError = action.error.message;
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
      // Delete Images
      .addCase(deleteProductImages.pending, (state) => {
        state.deleteImagesStatus = 'loading';
      })
      .addCase(deleteProductImages.fulfilled, (state, action) => {
        state.deleteImagesStatus = 'succeeded';
        if (state.product) {
          state.product.images = [];
      }
      })
      .addCase(deleteProductImages.rejected, (state, action) => {
        state.deleteImagesStatus = 'failed';
        state.deleteImagesError = action.error.message;
      });
  },
});

// Export actions if needed
// export const {} = productsSlice.actions;

// Export reducer
export default productsSlice.reducer;

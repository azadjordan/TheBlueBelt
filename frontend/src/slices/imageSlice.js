import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IMAGES_URL } from '../constants';


// Async thunk action to fetch all images
export const fetchImages = createAsyncThunk(
  'images/fetchImages',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(IMAGES_URL);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk action to delete an image
export const deleteImage = createAsyncThunk(
  'images/deleteImage',
  async (imageId, { rejectWithValue }) => {
    try {
      await axios.delete(`${IMAGES_URL}/${imageId}`);
      return imageId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


// Initial state
const initialState = {
  images: [],
  fetchImagesStatus: 'idle',
  error: null,
};

// Slice
const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.fetchImagesStatus = 'loading';
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.fetchImagesStatus = 'succeeded';
        state.images = action.payload;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.fetchImagesStatus = 'failed';
        state.error = action.payload.message;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter(image => image._id !== action.payload);
        state.deleteImageStatus = 'idle'
      })
      .addCase(deleteImage.rejected, (state, action) => {
        // Handle the error case
        state.error = action.payload.message;
      });
      // You can add more cases for other actions like delete, update, etc.
  },
});

// Export actions if needed
// export const {} = imagesSlice.actions;

// Export reducer
export default imagesSlice.reducer;

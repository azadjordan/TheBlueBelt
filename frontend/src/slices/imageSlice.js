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

// Async thunk action to upload images
export const uploadImages = createAsyncThunk(
  'images/uploadImages',
  async ({ formData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/api/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return data; // data is an object, and images array is one of it's fields
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);



// Initial state
const initialState = {
  images: [],
  urls: [],
  selectedImages: [],
  fetchImagesStatus: 'idle',
  uploadImagesStatus: 'idle',
  error: null,
};

// Slice
const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    selectImage: (state, action) => {
      state.selectedImages.push(action.payload);
    },
    deselectImage: (state, action) => {
      state.selectedImages = state.selectedImages.filter(url => url !== action.payload);
    },
    clearSelectedImages: (state) => {
      state.selectedImages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImages.pending, (state) => {
        state.fetchImagesStatus = 'loading';
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.fetchImagesStatus = 'succeeded';
        state.images = action.payload.images || []; // Fallback to empty array if undefined
        state.urls = state.images.map(image => image.imageUrl);
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
      })
      .addCase(uploadImages.pending, (state) => {
        state.uploadImagesStatus = 'loading';
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.images = [...action.payload, ...state.images]; // Add new images to the state
        state.uploadImagesStatus = 'idle'
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.error = action.payload.message;
      });
  },
});

// Export actions if needed
// export const {} = imagesSlice.actions;
export const { selectImage, deselectImage, clearSelectedImages } = imagesSlice.actions;


// Export reducer
export default imagesSlice.reducer;

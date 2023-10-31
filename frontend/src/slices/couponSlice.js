import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Create the asyncThunk
export const validateCoupon = createAsyncThunk(
  'coupon/validateCoupon',
  async (couponCode, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/coupons/validate", { code: couponCode });
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const couponSlice = createSlice({
    name: "coupon",
    initialState: { 
      discount: null, 
      couponError: null,
      couponStatus: 'idle' 
    }, 
    reducers: {
      resetDiscount: (state) => {
        state.discount = null;
        state.couponError = null;
        state.couponStatus = 'idle';
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(validateCoupon.pending, (state) => {
          state.couponStatus = 'loading'; 
          state.couponError = null; 
        })
        .addCase(validateCoupon.fulfilled, (state, action) => {
          state.discount = action.payload.discountAmount; 
          state.couponStatus = 'succeeded'; 
          state.couponError = null; 
        })
        .addCase(validateCoupon.rejected, (state, action) => {
          state.couponStatus = 'failed'; 
          state.couponError = action.payload; 
          console.log(state.couponError);
        });
    }
});

export const { resetDiscount } = couponSlice.actions;
export default couponSlice.reducer;

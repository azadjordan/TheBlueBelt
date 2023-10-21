import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk action to get PayPal client ID
export const getPayPalClientId = createAsyncThunk(
  "paypal/getClientId",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/config/paypal");
      return data.clientId;
    } catch (err) {
      console.error('Error in getPayPalClientId:', err);  // For debugging
      return rejectWithValue(err.response.data);
    }
  }
);

// Your thunk action for processing payment
export const payOrder = createAsyncThunk(
  "order/payOrder",
  async ({ orderId, paymentData }, { rejectWithValue }) => {
    console.log('hi');
    console.log(paymentData);
    try {
      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentData
      );
      return data;
    } catch (err) {
      console.error('Error in payOrder:', err);  // For debugging
      return rejectWithValue(err.response.data);
    }
  }
);

// Initial state
const initialState = {
  clientId: null,
  loadingPay: "idle",       // Status field for payOrder
  loadingPaypal: "idle",    // Status field for getPayPalClientId
  paypalError: null,        // Single error field for both actions
};

// Slice
const paypalSlice = createSlice({
  name: "paypal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // For getPayPalClientId
      .addCase(getPayPalClientId.pending, (state) => {
        state.loadingPaypal = "loading";
      })
      .addCase(getPayPalClientId.fulfilled, (state, action) => {
        state.loadingPaypal = "succeeded";
        state.clientId = action.payload;
        state.paypalError = null;
      })
      .addCase(getPayPalClientId.rejected, (state, action) => {
        state.loadingPaypal = "failed";
        state.paypalError = action.payload.message;
      })
      // For payOrder
      .addCase(payOrder.pending, (state) => {
        state.loadingPay = "loading";
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.loadingPay = "succeeded";
        state.paypalError = null;
        // process the successful data as needed
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.loadingPay = "failed";
        state.paypalError = action.payload.message;
      });
  },
});

export default paypalSlice.reducer;


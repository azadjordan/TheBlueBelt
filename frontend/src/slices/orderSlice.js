import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/orders", order);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/orders/${orderId}`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  order: null,
  orderStatus: "idle",
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // create
      .addCase(createOrder.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.error = action.payload.message;
      });
    // fetch order
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.error = action.payload.message;
      });
  },
});

export default orderSlice.reducer;

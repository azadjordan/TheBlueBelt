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

// Async thunk action to get logged-in user's orders
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/orders/mine");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Add this asynchronous thunk action to fetch all orders
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/orders");
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

// Async thunk action to update order to delivered
export const updateOrderToDelivered = createAsyncThunk(
  "order/updateOrderToDelivered",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/api/orders/${orderId}/deliver`);
      return data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const initialState = {
  singleOrder: {},
  orders: [],
  allOrders: [], 
  orderStatus: "idle",
  orderError: null,
  deliveredOrder: null,
  deliveredOrderStatus: "idle",
  deliveredOrderError: null,
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
        state.singleOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.payload.message;
      })
      // fetch single order
      .addCase(fetchOrder.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.singleOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.payload.message;
      })
      // fetch multiple orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.payload.message;
      })
      // fetch all orders for the admin
      .addCase(fetchAllOrders.pending, (state) => {
        state.orderStatus = "loading";
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.orderStatus = "succeeded";
        state.allOrders = action.payload;  // Store fetched orders in allOrders
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.orderStatus = "failed";
        state.orderError = action.payload.message;
      })
   // update order to delivered
   .addCase(updateOrderToDelivered.pending, (state) => {
    state.deliveredOrderStatus = "loading";
  })
  .addCase(updateOrderToDelivered.fulfilled, (state, action) => {
    state.deliveredOrderStatus = "succeeded";
    state.deliveredOrder = action.payload;
  })
  .addCase(updateOrderToDelivered.rejected, (state, action) => {
    state.deliveredOrderStatus = "failed";
    state.deliveredOrderError = action.payload.message;
  });
  },
});


export default orderSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice.js';
import cartReducer from './slices/cartSlice.js';
import authReducer from './slices/authSlice.js';
import orderReducer from './slices/orderSlice.js';
import paypalReducer from "./slices/paypalSlice";


const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    paypal: paypalReducer,

  },
  devTools: true,
});

export default store;

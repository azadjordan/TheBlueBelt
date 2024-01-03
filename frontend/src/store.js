import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice.js';
import cartReducer from './slices/cartSlice.js';
import authReducer from './slices/authSlice.js';
import orderReducer from './slices/orderSlice.js';
import couponReducer from './slices/couponSlice.js'
import imagesReducer from './slices/imageSlice.js'

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    coupon: couponReducer,
    images: imagesReducer,

  },
  devTools: true,
});

export default store;

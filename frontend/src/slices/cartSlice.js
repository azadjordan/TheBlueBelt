import { createSlice } from '@reduxjs/toolkit'
import { addDecimals, updateCart } from '../utils/cartUtils';


// Fill the cart if any item/s were added to it
const initialState = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : 
{cartItems: [], shipingAddress: {}, paymentMethod: 'Later'}



const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x._id === item._id);
            if (existItem) {
            state.cartItems = 
            state.cartItems.map((x) => x._id === existItem._id ? item : x)
            } else {
                state.cartItems = [...state.cartItems, item]
            }

           return updateCart(state)
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x)=> x._id !== action.payload)
            return updateCart(state)
        },
        saveShippingAddress: (state, action) => {
            state.shippingAddress = action.payload
            return updateCart(state)
        },
        savePaymentMethod: (state, action)=>{
            state.paymentMethod = action.payload
            return updateCart(state)
        },
        clearCartItems: (state, action)=>{
            state.cartItems=[]
            return updateCart(state)
        },
        resetCart: (state)=> (state = initialState),
          
     },
})

export const {clearCartItems, addToCart, removeFromCart, saveShippingAddress, savePaymentMethod, resetCart } = cartSlice.actions
export default cartSlice.reducer
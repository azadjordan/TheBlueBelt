export const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

export const updateCart = (state) => {
     // Calculate items price
     state.itemsPrice = addDecimals( state.cartItems.reduce((acc, item)=> acc + item.price * item.qty, 0))
     // Calculate shipping price (if order is over AED 300 then free, else AED 30 shipping)
     state.shippingPrice = addDecimals(state.itemsPrice > 300 ? 0 : 30)
     // Calculate tax price (VAT is 5% for UAE)
     state.taxPrice = addDecimals(Number((0.05 * state.itemsPrice).toFixed(2)))
     // Calculate total price
     state.totalPrice = (
         Number(state.itemsPrice) +
         Number(state.shippingPrice) +
         Number(state.taxPrice)
     ).toFixed(2)

     localStorage.setItem('cart', JSON.stringify(state))

     return state
}
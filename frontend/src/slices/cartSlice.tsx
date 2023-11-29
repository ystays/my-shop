import { createSlice } from "@reduxjs/toolkit";

const cart = localStorage.getItem('cart');
const initialState = cart !== null
? JSON.parse(cart) 
: { cartItems: [] };

const addDecimals = (num: number) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;

            const existItem = state.cartItems.find((x: any) => x._id === item._id);

            if (existItem) {
                state.cartItems = state.cartItems.map((x: any) => x._id === existItem._id ? item : x);
            } else {
                state.cartItems = [...state.cartItems, item];
            }

            state.itemsPrice = addDecimals(state.cartItems.reduce((acc:number, item:any) => acc + item.price * item.qty, 0));

            // calculate shipping price (if order is >$100 then free, else $10 shipping)
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
        
            state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));

            state.totalPrice = (
                Number(state.itemsPrice) + Number(state.shippingPrice) + Number(state.taxPrice)
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state));
        }
    },
});

export const { addToCart } = cartSlice.actions;

export default cartSlice.reducer;
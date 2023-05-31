import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    removeItem: (state, action) => {
      const index = state.products.findIndex((item) => item._id === action.payload);
      if (index !== -1) {
        state.products.splice(index, 1);
      }
    },
    decreaseCartItemQuantity: (state, action) => {
      const { cartId, productId } = action.payload;
      const cart = state.products.find((item) => item._id === cartId);
      if (cart) {
        const product = cart.products.find((item) => item._id === productId);
        if (product) {
          if (product.quantity > 1) {
            product.quantity--;
          }
        }
      }
    },
    increaseCartItemQuantity: (state, action) => {
      const { cartId, productId } = action.payload;
      const cart = state.products.find((item) => item._id === cartId);
      if (cart) {
        const product = cart.products.find((item) => item._id === productId);
        if (product) {
          product.quantity++;
        }
      }
    },
  }
});

export const cartProductsSelector = state => state.cart.products;
export const cartQuantitySelector = state => state.cart.products.length;
export const cartTotalSelector = state => state.cart.products.reduce(
  (total, { price = 0, quantity = 1 }) => total + quantity * price,
  0,
);

export const {
  addProduct,
  removeItem,
  decreaseCartItemQuantity,
  increaseCartItemQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;

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
        console.log(state.products);
        if (index !== -1) {
          state.products.splice(index, 1);
        }
      }
    }
  });
  

  export const cartProductsSelector = state => state.cart.products;
  export const cartQuantitySelector = state => state.cart.products.length;
  export const cartTotalSelector = state => state.cart.products.reduce(
    (total, { price = 0, quantity = 1 }) => total + quantity * price,
    0,
  );

  export const { addProduct, removeItem } = cartSlice.actions
  export default cartSlice.reducer;


// const cartSlice = createSlice({
//     name: "cart",
//     initialState: {
//         products: [],
//         quantity: 0,
//         total: 0,
//     },
//     reducers: {
//         addProduct: (state, action) => {
//             state.quantity +=1;
//             state.products.push(action.payload);
//             state.total += action.payload.price * action.payload.quantity;
//         },
//         removeItem: (state, action) => {
//             state.products.splice(state.products.findIndex((arrow) => arrow.id === action.payload), 1);
//         },
//         purchasedProduct: (state) => {
//             state.products = [];
//             state.quantity = 0;
//             state.total = 0;
//         }
//     }
// })

// export const { addProduct, removeItem, purchasedProduct } = cartSlice.actions
// export default cartSlice.reducer;
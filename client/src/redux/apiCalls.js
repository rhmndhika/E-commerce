import { loginFailure, loginStart, loginSuccess } from "./userRedux"
import { publicRequest, userMethod } from '../useFetch';
import { addProduct, removeItem } from "./cartRedux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';


export const login = async (dispatch, user, notify) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("/login", user);
        Cookies.set('token', res.data.accessToken, { expires: 3 });
        dispatch(loginSuccess(res.data));
    } catch (err) {
        dispatch(loginFailure());
    }
}

export const addToCart = async (dispatch, product, quantity, user) => {
    try {
        const res = await userMethod.post("/cart/create", {
            userId: product.user,
            products: product,
            bill: product.quantity * product.price
        })
        dispatch(addProduct({ ...product }));
    } catch (err) {
        console.log(err);
    }
}

export const removeCartItem = createAsyncThunk(
    "cart/removeItem",
    async (cartId, thunkAPI) => {
      try {
        const res = await userMethod.delete(`/cart/delete/${cartId}`);
      } catch (error) {
        console.log(error);
        return thunkAPI.rejectWithValue(error);
      }
    }
  );


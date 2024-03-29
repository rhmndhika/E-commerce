import { loginFailure, loginStart, loginSuccess } from "./userRedux"
import { publicRequest, userMethod } from '../useFetch';
import { addProduct } from "./cartRedux";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from 'js-cookie';
import { setModal, setError } from "./global";


export const login = async (dispatch, user, notify) => {
    dispatch(loginStart());
    try {
         await publicRequest.post("/login", user).then((response) => {
            if (response) {
                Cookies.set('token', response.data.accessToken, { expires: 3 });
                Cookies.set('userId', response.data._id, { expires: 3 });
                Cookies.set('username', response.data.username, { expires: 3 });
                Cookies.set('email', response.data.email, { expires: 3 });
                dispatch(setModal(true));
                notify();
                setTimeout(() => {
                    dispatch(loginSuccess(response.data));
                    dispatch(setModal(false));
                }, 3000);
            }
        })
 
    } catch (err) {
        dispatch(loginFailure());
        dispatch(setError(err.response.data.message));
        setTimeout(() => {
            dispatch(setError(""));
        }, 1000) 
    }
}

export const addToCart = async (dispatch, product, quantity, user) => {
    const tokenUserId = Cookies.get('userId');
    try {
        const res = await userMethod.post("/cart/create", {
            userId: tokenUserId,
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


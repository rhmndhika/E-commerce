import { deleteUsersFailure, deleteUsersStart, deleteUsersSuccess, getUsersStart, getUsersSuccess, loginFailure, loginStart, loginSuccess, updateUsersFailure, updateUsersStart, updateUsersSuccess } from "./userRedux"
import { publicRequest, userRequest } from '../useFetch';
import { addProductFailure, addProductStart, addProductSuccess, deleteProductFailure, deleteProductStart, deleteProductSuccess, getProductFailure, getProductStart, getProductSuccess, updateProductFailure, updateProductStart, updateProductSuccess } from "./productRedux";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
      await publicRequest.post("/login", user).then((res) => {
        console.log("Login response:", res.data);
        Cookies.set('token', res.data.accessToken, { expires: 3 });
        Cookies.set('userId', res.data._id, { expires: 3 });
        Cookies.set('username', res.data.username, { expires: 3 });
        Cookies.set('email', res.data.email, { expires: 3 });
        console.log("Cookies set:", {
          token: res.data.accessToken,
          userId: res.data._id,
          username: res.data.username,
          email: res.data.email
        });
        dispatch(loginSuccess(res.data));
      });
    } catch (err) {
      console.error("Login error:", err);
      dispatch(loginFailure());
    }
  }
  

export const getProduct = async (dispatch) => {
    dispatch(getProductStart());
    try {
        const res = await publicRequest.get("/product/all");
        dispatch(getProductSuccess(res.data));
    } catch (err) {
        dispatch(getProductFailure());
    }
}

export const deleteProduct = async (dispatch, id) => {
    dispatch(deleteProductStart());
    try {
        const res = await userRequest.delete(`/product/delete/${id}`);
        dispatch(deleteProductSuccess(id));
    } catch (err) {
        dispatch(deleteProductFailure());
    }
}

export const updateProduct = async (dispatch, product, id) => {
    dispatch(updateProductStart());
    try {
        const res = await userRequest.put(`/product/update/${id}`, product);
        dispatch(updateProductSuccess({ product, id }));
    } catch (err) {
        dispatch(updateProductFailure());
    }
}

export const addProduct = async (dispatch, product) => {
    dispatch(addProductStart());
    try {
        const res = await userRequest.post("/product/add", product);
        dispatch(addProductSuccess(res.data));
    } catch (err) {
        dispatch(addProductFailure());
    }
}

export const getUserList = async (dispatch) => {
    dispatch(getUsersStart());
    try {
        const res = await userRequest.get("/users");
        dispatch(getUsersSuccess(res.data));
    } catch (err) {
        dispatch(getProductFailure());
    }
}

export const deleteUser= async (dispatch, id) => {
    dispatch(deleteUsersStart());
    try {
        const res = await userRequest.delete(`/users/delete/${id}`);
        dispatch(deleteUsersSuccess(id));
    } catch (err) {
        dispatch(deleteUsersFailure());
    }
}

export const updateUser = async (dispatch, user, id) => {
    dispatch(updateUsersStart());
    try {
        const res = await userRequest.put(`/users/update/${id}`, user);
        dispatch(updateUsersSuccess({ user, id }));
    } catch (err) {
        dispatch(updateUsersFailure());
    }
}



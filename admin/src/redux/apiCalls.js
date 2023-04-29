import { deleteUsersFailure, deleteUsersStart, deleteUsersSuccess, getUsersStart, getUsersSuccess, loginFailure, loginStart, loginSuccess, updateUsersFailure, updateUsersStart, updateUsersSuccess } from "./userRedux"
import { publicRequest, userMethod } from '../useFetch';
import { addProductFailure, addProductStart, addProductSuccess, deleteProductFailure, deleteProductStart, deleteProductSuccess, getProductFailure, getProductStart, getProductSuccess, updateProductFailure, updateProductStart, updateProductSuccess } from "./productRedux";


export const login = async (dispatch, user) => {
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("/login", user);
        dispatch(loginSuccess(res.data));
    } catch (err) {
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
        const res = await userMethod.delete(`/product/delete/${id}`);
        dispatch(deleteProductSuccess(id));
    } catch (err) {
        dispatch(deleteProductFailure());
    }
}

export const updateProduct = async (dispatch, product, id) => {
    dispatch(updateProductStart());
    try {
        const res = await userMethod.put(`/product/update/${id}`, product);
        dispatch(updateProductSuccess({ product, id }));
    } catch (err) {
        dispatch(updateProductFailure());
    }
}

export const addProduct = async (dispatch, product) => {
    dispatch(addProductStart());
    try {
        const res = await userMethod.post("/product/add", product);
        dispatch(addProductSuccess(res.data));
    } catch (err) {
        dispatch(addProductFailure());
    }
}

export const getUserList = async (dispatch) => {
    dispatch(getUsersStart());
    try {
        const res = await userMethod.get("/users");
        dispatch(getUsersSuccess(res.data));
    } catch (err) {
        dispatch(getProductFailure());
    }
}

export const deleteUser= async (dispatch, id) => {
    dispatch(deleteUsersStart());
    try {
        const res = await userMethod.delete(`/users/delete/${id}`);
        dispatch(deleteUsersSuccess(id));
    } catch (err) {
        dispatch(deleteUsersFailure());
    }
}

export const updateUser = async (dispatch, user, id) => {
    dispatch(updateUsersStart());
    try {
        const res = await userMethod.put(`/users/update/${id}`, user);
        dispatch(updateUsersSuccess({ user, id }));
    } catch (err) {
        dispatch(updateUsersFailure());
    }
}



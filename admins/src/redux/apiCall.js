import { deleteUsersFailure, deleteUsersStart, deleteUsersSuccess, getUsersStart, getUsersSuccess, loginFailure, loginStart, loginSuccess, updateUsersFailure, updateUsersStart, updateUsersSuccess } from "./userRedux"
import { publicRequest, userRequest } from '../useFetch';
import { addProductFailure, addProductStart, addProductSuccess, deleteProductFailure, deleteProductStart, deleteProductSuccess, getProductFailure, getProductStart, getProductSuccess, updateProductFailure, updateProductStart, updateProductSuccess } from "./productRedux";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';


export const login = async (dispatch, user, toast) => {
    dispatch(loginStart());
    try {
      await publicRequest.post("/login", user).then((res) => {
        console.log("Login response:", res.data);
        Cookies.set('token', res.data.accessToken, { expires: 3 });
        Cookies.set('userId', res.data._id, { expires: 3 });
        Cookies.set('username', res.data.username, { expires: 3 });
        Cookies.set('email', res.data.email, { expires: 3 });
        toast({
            title: 'Logging In',
            status: 'success',
            duration: 1000,
            isClosable: true,
        });
        setTimeout(() => {
            dispatch(loginSuccess(res.data));
        }, 1000)
      });
    } catch (err) {
        console.log(err);
      dispatch(loginFailure());
      if (err.response?.data) {    
          toast({
            title: err.response.data?.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
      } else {
        toast({
            title: err.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
      }
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

export const deleteProduct = async (dispatch, id, toast) => {
    dispatch(deleteProductStart());
    try {
        const res = await userRequest.delete(`/product/delete/${id}`).then((res) => {
            toast({
                title: 'Product has been deleted',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            dispatch(deleteProductSuccess(id));
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        })
    } catch (err) {
        toast({
            title: err.response.data,
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
        dispatch(deleteProductFailure());
    }
}

export const updateProduct = async (dispatch, product, id, toast) => {
    dispatch(updateProductStart());
    try {
        const res = await userRequest.put(`/product/update/${id}`, product).then((res) => {
            toast({
                title: 'Updating Product.',
                status: 'success',
                duration: 9000,
                isClosable: true,
              });
            dispatch(updateProductSuccess({ product, id }));
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        })
    } catch (err) {
        dispatch(updateProductFailure());
        toast({
            title: err.response.data,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
}

export const addProduct = async (dispatch, product, toast) => {
    dispatch(addProductStart());
    try {
        const res = await userRequest.post("/product/add", product).then((res) => {
            dispatch(addProductSuccess(res.data));
            toast({
                title: 'Creating New Product.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            });
            dispatch(loginSuccess(res.data));
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        })
    } catch (err) {
        console.log(err)
        dispatch(addProductFailure());
        toast({
            title: err.response.data,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
        console.log(err)
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

export const deleteUser= async (dispatch, id, toast) => {
    dispatch(deleteUsersStart());
    try {
        const res = await userRequest.delete(`/users/delete/${id}`).then((res) => {
            toast({
                title: 'User deleted',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            dispatch(deleteUsersSuccess(id));
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        })
    } catch (err) {
        dispatch(deleteUsersFailure());
        toast({
            title: err.response.data,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
}

export const updateUser = async (dispatch, user, id, toast) => {
    dispatch(updateUsersStart());
    try {
        const res = await userRequest.put(`/users/update/${id}`, user).then((res) => {
            toast({
                title: 'Account updated.',
                status: 'success',
                duration: 9000,
                isClosable: true,
              })
            dispatch(updateUsersSuccess({ user, id }));
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        })
    } catch (err) {
        dispatch(updateUsersFailure());
        toast({
            title: err.response.data,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
}




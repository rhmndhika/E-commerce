import axios from 'axios';
import { store } from './redux/store';
import Cookies from 'js-cookie'

const BASE_URL = "https://e-commerce-production-25ef.up.railway.app";

// const user = store.getState().user.currentUser.accessToken;
const TOKEN = (JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser?.accessToken);
const token = Cookies.get('token');

export const publicRequest = axios.create({
    baseURL: BASE_URL
})


export const userMethod = axios.create({
    baseURL: BASE_URL,
    headers: {token: `Bearer ${TOKEN}`}
})
    

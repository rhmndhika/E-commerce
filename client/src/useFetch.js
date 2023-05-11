import axios from 'axios'
import { store } from './redux/store'
import Cookies from 'js-cookie'

const BASE_URL = "http://localhost:5000";

// const TOKEN = (JSON.parse(JSON.parse(sessionStorage.getItem("persist:root")).user).currentUser?.accessToken);

const token = Cookies.get('token');

export const publicRequest = axios.create({
    baseURL: BASE_URL
})


export const userMethod = axios.create({
    baseURL: BASE_URL,
    headers: {token: `Bearer ${token}`}
})
    
// export const userMethod = axios.create({
//     baseURL: BASE_URL,
//     headers: {token: `Bearer ${TOKEN}`}
// })
    

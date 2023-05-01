import axios from 'axios';
import { store } from './redux/store'

const BASE_URL = "http://e-commerce-production-75aa.up.railway.app";

// const TOKEN = (JSON.parse(JSON.parse(sessionStorage.getItem("persist:root")).user).currentUser?.accessToken);

export const publicRequest = axios.create({
    baseURL: BASE_URL
})


export const userMethod = axios.create({
    baseURL: BASE_URL,
    headers: {token: `Bearer ${localStorage.getItem("token")}`}
})
    
// export const userMethod = axios.create({
//     baseURL: BASE_URL,
//     headers: {token: `Bearer ${TOKEN}`}
// })
    

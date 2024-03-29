import axios from 'axios';
import Cookies from 'js-cookie'

const BASE_URL = "https://e-commerce-production-25ef.up.railway.app";


const token = Cookies.get('token');

export const publicRequest = axios.create({
    baseURL: BASE_URL
})


export const userRequest = axios.create({
    baseURL: BASE_URL,
    headers: {token: `Bearer ${token}`}
})
    

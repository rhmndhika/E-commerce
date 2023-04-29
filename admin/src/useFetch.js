import React from 'react';
import axios from 'axios';
import { store } from './redux/store';


const BASE_URL = "http://localhost:5000";

// const user = store.getState().user.currentUser.accessToken;
const TOKEN = (JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser?.accessToken);

export const publicRequest = axios.create({
    baseURL: BASE_URL
})


export const userMethod = axios.create({
    baseURL: BASE_URL,
    headers: {token: `Bearer ${TOKEN}`}
})
    

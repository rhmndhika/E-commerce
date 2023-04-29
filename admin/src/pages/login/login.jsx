import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/apiCalls';


export default function Login() {

    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");
    const dispatch = useDispatch();
   
   
    const handleLogin = (e) => {
      e.preventDefault();
      login(dispatch, { username, password });
    }

    return (
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent:"center", 
        height: "100vh"
        }}>
        <input style={{padding: "10px", marginBottom: "20px"}} type="text" placeholder="username" onChange={(e) => {
            setUsername(e.target.value)}} />
        <input style={{padding: "10px", marginBottom: "20px"}} type="password" placeholder="password" onChange={(e) => {
            setPassword(e.target.value)}} />
        <button style={{padding: "10px", width: "100px"}} onClick={handleLogin}>Login</button>
      </div>
    );
  }
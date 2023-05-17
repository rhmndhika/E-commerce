import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import Home from './scenes/home/Home';
import Login from './components/Login/Login';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import Testing from './components/Test/Testing';
import User from './scenes/global/User/User';
import UserList from './scenes/global/UserList/UserList';
import ProductList from './scenes/global/ProductList/ProductList';
import Product from './scenes/global/Product/Product';
import TransactionList from './scenes/global/TransactionList/TransactionList';
import TransactionDetails from './scenes/global/TransactionDetails/TransactionDetails';
import Invoice from './components/Invoice/Invoice';



function App() {

  // const user = useSelector((state) => state.user.currentUser);
  const user = useSelector((state) => state.user.currentUser);
  const token = Cookies.get('token');
  const tokenUserId = Cookies.get('userId');

  

  return (
    <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route exact path='/' element={user  ? <Navigate to="/home" replace={true} /> : <Login />}/>
        <Route path='/userList' element={<UserList />} />
        <Route path='/user/:id' element={<User />} />
        <Route path='/productList' element={<ProductList />} />
        <Route path='/single/product/:id' element={<Product />} />
        <Route path='/transactionList' element={<TransactionList />} />
        <Route path='/transaction/detail/:id' element={<TransactionDetails />} />
        <Route path='/user/order/:id/invoice' element={<Invoice />} />
      </Routes>
    </BrowserRouter>
    </ChakraProvider>
  //   <ChakraProvider>
  //   <BrowserRouter>
  //   <Routes>
  //     <Route path='/' element={tokenUserId ? <Navigate to="/home" replace={true} /> : <Login />} />
  //     <Route path='/home' element={<Home />} />
  //     <Route path='/test' element={<Testing />} />
  //   </Routes>
  //   </BrowserRouter>
  // </ChakraProvider>
  );
}

export default App;

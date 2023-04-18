import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './scenes/home/Home';
import Signup from './components/SignUp';
import ProductList from './scenes/global/ProductList';
import Product from './scenes/global/Product';
import SignIn from './components/SignIn';
import Cart from './scenes/global/Cart';
import Payment from './scenes/global/Payment';
import Succes from './scenes/global/Succes'
import { useSelector } from 'react-redux'

function App() {

  const user = useSelector((state) => state.user.currentUser);

  return (
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={ user? <Navigate to="/" /> : <Signup />} />
        <Route path='/signin' element={ user ? <Navigate to="/" /> : <SignIn />} />
        <Route path='/productList/:category' element={<ProductList />} />
        <Route path='/productSingle/:id' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/pay' element={<Payment />} />
        <Route path='/success' element={<Succes />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
  );
}

export default App;

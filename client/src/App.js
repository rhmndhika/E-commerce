import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './scenes/home/Home';
import Signup from './components/SignUp';
import ProductList from './scenes/global/ProductList';
import Product from './scenes/global/Product';
import SignIn from './components/SignIn';
import Cart from './scenes/global/Cart';
import Succes from './scenes/global/Succes'
import { useSelector } from 'react-redux'
import OrderHistory from './scenes/global/OrderHistory';
import Invoices from './scenes/global/Invoices';
import UserProfile from './scenes/global/UserProfile';
import Welcome from './components/Welcome';
import UserWishlist from './scenes/global/UserWishlist';
import Testing from './scenes/global/Testing';
import Reviewed from './components/Reviewed';
import ReviewPage from './scenes/global/ReviewPage';
import ReviewList from './scenes/global/ReviewList';
import CarouselContent1 from './scenes/global/CarouselContent1';
import ResetPassword from './components/ResetPasswod';


function App() {

  const user = useSelector((state) => state.user.currentUser);

  return (
  <ChakraProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={ user ? <Navigate to="/welcome" replace={true} /> : <Signup />} />
        <Route path='/signin' element={ user ? <Navigate to="/welcome" replace={true} /> : <SignIn />} />
        <Route path='/welcome' element={<Welcome />} />
        <Route path='/productList/:category' element={<ProductList />} />
        <Route path='/productSingle/:id' element={<Product />} />
        <Route path='/cart/:id' element={<Cart />} />
        <Route path='/success' element={<Succes />} />
        <Route path='/order/history' element={<OrderHistory />} />
        <Route path='/order/history/detail/:id' element={<Invoices />} />
        <Route path='/user/profile/:id' element={<UserProfile />} />
        <Route path='/user/wishlist/:id' element={<UserWishlist />} />
        <Route path='/user/review/:id' element={<ReviewPage />} />
        <Route path='/user/reviewList/:id' element={<ReviewList />} />
        <Route path='/reviewed/:id' element={<Reviewed />} />
        <Route path='/carouselcontent1' element={<CarouselContent1 />} />
        <Route path='/forgot-password/:token' element={<ResetPassword />} />
        <Route path='/testing' element={<Testing />} />
      </Routes>
    </BrowserRouter>
  </ChakraProvider>
  );
}

export default App;

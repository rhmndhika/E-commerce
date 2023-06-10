import React, { lazy, Suspense, useEffect} from 'react';
import { Spinner } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserProfileProvider from './helper/UserProfileProvider';
import Cookies from 'js-cookie';
import PrivateRoute from './PrivateRoute';


const Home = lazy(() => import("./scenes/home/Home"));
const Signup = lazy(() => import('./components/SignUp'));
const ProductList = lazy(() => import('./scenes/global/ProductList'));
const Product = lazy(() => import('./scenes/global/Product'));
const SignIn = lazy(() => import('./components/SignIn'));
const Cart = lazy(() => import('./scenes/global/Cart'));
const Succes = lazy(() => import('./scenes/global/Succes'));
const OrderHistory = lazy(() => import('./scenes/global/OrderHistory'));
const Invoices = lazy(() => import('./scenes/global/Invoices'));
const UserProfile = lazy(() => import('./scenes/global/UserProfile'));
const Welcome = lazy(() => import('./components/Welcome'));
const UserWishlist = lazy(() => import('./scenes/global/UserWishlist'));
const Testing = lazy(() => import('./scenes/global/Testing'));
const Reviewed = lazy(() => import('./components/Reviewed'));
const ReviewPage = lazy(() => import('./scenes/global/ReviewPage'));
const ReviewList = lazy(() => import('./scenes/global/ReviewList'));
const CarouselContent1 = lazy(() => import('./scenes/global/CarouselContent1'));
const ResetPassword = lazy(() => import('./components/ResetPasswod'));
const SearchPage = lazy(() => import('./scenes/global/SearchPage'));

function App() {

  const user = useSelector((state) => state.user.currentUser);
  const tokenUserId = Cookies.get('userId');


  return (
    <ChakraProvider>
        <BrowserRouter>
        <Suspense fallback={
          <div style={{display : "flex", justifyContent : "center", alignItems : "center", height: "100%", marginTop : "300px"}}>
          <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
            />
          </div>}>
          <UserProfileProvider>
          <Routes>
            <Route path='/' element={
                <Home />
            } />
            <Route path='/signup' element={ tokenUserId ? <Navigate to="/welcome" replace={true} /> : <Signup />} />
            <Route path='/signin' element={ tokenUserId ? <Navigate to="/welcome" replace={true} /> : <SignIn />} />
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
            <Route path='/product/search' element={<SearchPage />} />
            <Route path='/testing' element={<Testing />} />
          </Routes>
          </UserProfileProvider>
        </Suspense>
        </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

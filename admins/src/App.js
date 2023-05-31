import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
import ReviewList from './scenes/global/ReviewList/ReviewList';
import Reviewed from './components/Reviewed/Reviewed';
import Category from './scenes/global/Category/Category';
import CategoryList from './scenes/global/CategoryList/CategoryList';
import Register from './components/Register/Register';
import ResetPassword from './components/ResetPassword/ResetPassword';

function App() {
  const user = useSelector((state) => state.user.currentUser);
  const token = Cookies.get('token');

  const renderProtectedRoute = (element, path) => {
    return token ? element : <Navigate to="/" replace={true} />;
  };

  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/home" replace={true} /> : <Login />}
          />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password/:token' element={<ResetPassword />} />
          <Route
            path="/home"
            element={renderProtectedRoute(<Home />, '/home')}
          />
          <Route
            path="/userList"
            element={renderProtectedRoute(<UserList />, '/userList')}
          />
          <Route
            path="/user/:id"
            element={renderProtectedRoute(<User />, '/user/:id')}
          />
          <Route
            path="/productList"
            element={renderProtectedRoute(<ProductList />, '/productList')}
          />
          <Route
            path="/single/product/:id"
            element={renderProtectedRoute(<Product />, '/single/product/:id')}
          />
          <Route
            path="/transactionList"
            element={renderProtectedRoute(
              <TransactionList />,
              '/transactionList'
            )}
          />
          <Route
            path="/transaction/detail/:id"
            element={renderProtectedRoute(
              <TransactionDetails />,
              '/transaction/detail/:id'
            )}
          />
          <Route
            path="/user/order/:id/invoice"
            element={renderProtectedRoute(<Invoice />, '/user/order/:id/invoice')}
          />
          <Route
            path="/reviewList"
            element={renderProtectedRoute(<ReviewList />, '/reviewList')}
          />
          <Route
            path="/reviewList/:id"
            element={renderProtectedRoute(<Reviewed />, '/reviewList/:id')}
          />
           <Route
            path="/categoryList"
            element={renderProtectedRoute(<CategoryList />, '/categoryList')}
          />
            <Route
            path="/category/detail/:id"
            element={renderProtectedRoute(<Category />, '/category/detail/:id')}
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;

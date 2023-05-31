import React, { useEffect, useState } from 'react';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import Slider from '../../components/Slider';
import Newsletter from '../../components/Newsletter';
import Footer from '../../components/Footer.tsx';
import Navbar from '../../components/Navbar.jsx'
import Search from '../../components/Search.jsx';


const Home = () => {

  return (
   <div>
    <Navbar />
      <Slider />
      <Categories />
      <Products />
      <Newsletter />
      <Footer />
   </div>
  )
}
export default Home
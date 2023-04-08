import React from 'react';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import Slider from '../../components/Slider';
import Newsletter from '../../components/Newsletter';
import Footer from '../../components/Footer.tsx';
import Navbar from '../../components/Navbar.tsx'

const Home = () => {
  return (
   <div>
    {/* <Navbar /> */}
      <Slider />
      <Categories />
      <Products />
      <Newsletter />
      <Footer />
   </div>
  )
}

export default Home
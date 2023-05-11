import React, { useEffect, useState } from 'react';
import Categories from '../../components/Categories';
import Products from '../../components/Products';
import Slider from '../../components/Slider';
import Newsletter from '../../components/Newsletter';
import Footer from '../../components/Footer.tsx';
import Navbar from '../../components/Navbar.jsx'
import { Flex, Text } from '@chakra-ui/react';


const Home = () => {

  return (
   <div>
    <Navbar />
      <Slider />
      <Categories />
      <Flex mt="-100px">
      <Text padding="30px" fontSize="3xl" as="b">Products</Text>
      </Flex>
      <Products />
      <Newsletter />
      <Footer />
   </div>
  )
}
export default Home
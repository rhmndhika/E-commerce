import React, { useEffect, useState } from 'react';  
import { popularProducts } from '../data';
import Product from './Product';
import { Flex, Text } from '@chakra-ui/react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
    padding: 30px;
    display: flex;
    flex-wrap: wrap;
    margin-top: -130px;
`

const Products = ({cat,filter,sort}) => {

  const [ products, setProducts ] = useState([]);
  const [ filteredProducts, setFilteredProducts ] = useState([]); 

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get( cat ? `http://localhost:5000/product/all?category=${cat}` : "http://localhost:5000/product/all");
        setProducts(response.data);
      }catch(err) {

      }
    };
    getProducts();
  }, [cat])

  useEffect(() => {
    cat &&
      setFilteredProducts(
        products.filter((item) =>
          Object.entries(filter).every(([key, value]) =>
            item[key].includes(value)
          )
        )
      );
  }, [products, cat, filter])

  useEffect(() => {
    if (sort === "Newest") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (sort === "Asc") {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    } else {
      setFilteredProducts((prev) =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [sort]);

  return (
    <Flex flexDirection="column" padding="30px" mt="-60px">
      <Flex flexWrap="wrap">
        { cat 
        ? filteredProducts.map((item) => ( <Product item={item} key={item.id} />)) 
        : products.slice(0, 8).map((item) => ( <Product item={item} key={item.id} />))}
      </Flex>
    </Flex>
  )
}

export default Products
import React, { useEffect, useState } from 'react';  
import { popularProducts } from '../data';
import Product from './Product';
import { Flex } from '@chakra-ui/react';
import styled from 'styled-components';
import axios from 'axios';

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    margin-top: -20px;
`

const Products = ({cat,filter,sort}) => {

  const [ products, setProducts ] = useState([]);
  const [ filteredProducts, setFilteredProducts ] = useState([]); 

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get( cat ? `https://e-commerce-production-75aa.up.railway.app/product/all?category=${cat}` : "https://e-commerce-production-75aa.up.railway.app/product/all");
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
    <Container>
        { cat 
        ? filteredProducts.map((item) => ( <Product item={item} key={item.id} />)) 
        : products.slice(0, 8).map((item) => ( <Product item={item} key={item.id} />))}
    </Container>
  )
}

export default Products
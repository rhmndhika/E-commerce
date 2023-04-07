import React from 'react';  
import { popularProducts } from '../data';
import Product from './Product';
import { Flex } from '@chakra-ui/react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    margin-top: -20px;
`

const Products = () => {

  return (
    <Container>
        {popularProducts.map((item) => (
            <Product item={item} key={item.id} />
        ))}
    </Container>
  )
}

export default Products
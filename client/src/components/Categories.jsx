import { Flex } from '@chakra-ui/react';
import React from 'react';
import { categories } from '../data'
import CategoryItem from './CategoryItem';
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const Categories = () => {
  return (
    <Container>
      {categories.map((item) => (
        <CategoryItem item={item} key={item.id} />
      ))}
    </Container>
    // <Flex alignItems="center" justifyContent="space-around" padding="20px" flex-wrap="wrap" gap="10px" mt="80px">
    //     {categories.map(item => (
    //         <CategoryItem item={item} key={item.id} />
    //     ))}
    // </Flex>
  )
}

export default Categories
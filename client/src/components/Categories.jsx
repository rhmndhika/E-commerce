import { Flex } from '@chakra-ui/react';
import React from 'react';
import { categories } from '../data'
import CategoryItem from './CategoryItem';
import styled from 'styled-components'
import { mobile, isMobile } from '../reponsive'

const Container = styled.div`
  display: flex;
  padding: 20px;
  justify-content: space-between;
  flex-wrap: wrap;
  ${isMobile({ padding: "0px", flexDirection: "column"})}
`;

const Categories = () => {
  return (
    <Flex flexDirection="row" alignItems="center" flexWrap="wrap" gap="10px" mt="20px">
      {categories.map((item) => (
        <CategoryItem item={item} key={item.id} />
        ))}
    </Flex>

  )
}

export default Categories
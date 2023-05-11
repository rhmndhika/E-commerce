import { Divider, Flex, Text } from '@chakra-ui/react';
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
    <Flex flexDirection="column">
      <Flex mt="50px">
        <Text padding="30px 0 0 30px" fontSize="3xl" as="b">Categories</Text>
      </Flex>

      <Flex alignItems="center" flexWrap="wrap" gap="30px" mt="5px">
      {categories.map((item) => (
        <CategoryItem item={item} key={item.id} />
        ))}
      </Flex>
      <Divider mt="10px" size="xl" />
    </Flex>
  )
}

export default Categories
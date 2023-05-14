import { Divider, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { categories } from '../data'
import CategoryItem from './CategoryItem';
import styled from 'styled-components'
import { mobile, isMobile } from '../reponsive'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  ${isMobile({ padding: "0px", flexDirection: "column"})}
  margin-top: 40px;
`;

{/* <Flex flexDirection="column" flexWrap="wrap">
<Flex mt="50px">
  <Text padding="30px 0 0 30px" fontSize="3xl" as="b">Categories</Text>
</Flex>

<Flex alignItems="center" gap="30px" mt="5px">
{categories.map((item) => (
  <CategoryItem item={item} key={item.id} />
  ))}
</Flex>
<Divider mt="10px" size="xl" />
</Flex> */}

const Categories = () => {
  return (
    <Container>
      {categories.map((item) => (
        <CategoryItem item={item} key={item.id} />
        ))}
    </Container>
  )
}

export default Categories
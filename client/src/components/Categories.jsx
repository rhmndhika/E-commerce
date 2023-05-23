import React, { useState, useEffect } from 'react';
import { Divider, Flex, Text } from '@chakra-ui/react';
// import { categories } from '../data'
import CategoryItem from './CategoryItem';
import styled from 'styled-components'
import { mobile, isMobile } from '../reponsive'
import { publicRequest } from '../useFetch';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  ${isMobile({ padding: "0px", flexDirection: "column"})}
  margin-top: 40px;
`;


const Categories = () => {

  const [ categories, setCategories ] = useState([]);

  useEffect(() => {
    const getOrderHistory = async () => {
        try{
            const response = await publicRequest.get("/categories/all")
            setCategories(response.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getOrderHistory();
}, [])

  return (
    <Container>
      {categories?.map((item) => (
        <CategoryItem item={item} key={item.id} />
        ))}
    </Container>
  )
}

export default Categories
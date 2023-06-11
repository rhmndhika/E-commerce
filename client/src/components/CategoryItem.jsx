import React from 'react'
import { Flex, Text, Button, Box, Stack, Heading, Image, Badge } from '@chakra-ui/react'
import styled from 'styled-components'
import { mobile, isMobile } from '../reponsive'
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();


const Container = styled.div`
  flex: 1;
  margin: 3px;
  height: 70vh;
  position: relative;
  display: flex;
  padding: 30px;
  
`;


const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
    color:black;
    font-weight: bold;
    margin-bottom: 20px;
    font-size: 20px;
`;


const CategoryItem = ({item}) => {
  return (
    <Container data-aos="fade-up">
      <Image
        h="337px"
        w="full"
        borderRadius="12px"
        mb="10px"
        src={item.img}
        alt="A house"
        fontSize="16px"
        objectFit="cover"
      />
      <Info>
        <Badge variant='solid' colorScheme='green' fontWeight="bold" marginBottom="20px" fontSize="15px">
          {item.cat}
        </Badge>
        <a href={`/productList/${item.cat}`}>
          <Button marginBottom="100px" padding="10px"  backgroundColor="white" color="black"cursor="pointer" fontWeight="600">SHOP NOW</Button>
        </a>
      </Info>
    </Container>
  )
}

export default CategoryItem
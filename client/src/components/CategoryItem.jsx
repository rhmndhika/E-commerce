import React from 'react'
import { Flex, Text, Button } from '@chakra-ui/react'
import styled from 'styled-components'
import { mobile, isMobile } from '../reponsive'

const Container = styled.div`
  flex: 1;
  margin: 3px;
  height: 70vh;
  position: relative;
  display: flex;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${isMobile({ height: "20vh", padding: "10px"})}
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
    color:white;
    margin-bottom: 20px;
`;

// const Button = styled.button`
//     border: none;
//     padding: 10px;
//     background-color: white;
//     color: black;
//     cursor: pointer;
//     font-weight: 600;
// `;

const CategoryItem = ({item}) => {
  return (
    <Container>
      <Image src={item.img} />
      <Info>
        <Title>{item.title}</Title>
        <Button border="none" padding="10px" backgroundColor="white" color="black" cursor="pointer" fontWeight="600">SHOP NOW</Button>
      </Info>
    </Container>
    // <Flex flexDirection="row" alignItems="center" justifyContent="center" margin="3px" position="relative" flex="1" height="70vh">
    //     <Flex>
    //         <Image src={item.img} width="100%" height="100%" objectFit="cover" />
    //     </Flex>
    //     <Flex position="absolute" width="100%" height="100%" top="0" left="0" alignItems="center" justifyContent="center" flexDirection="column">
    //         <Text color="white" marginBottom="20px" fontWeight="bold">{item.title}</Text>
    //         <Button border="none" padding="10px" backgroundColor="white" cursor="pointer" color="black">SHOP NOW</Button>
    //     </Flex>
    // </Flex>
  )
}

export default CategoryItem
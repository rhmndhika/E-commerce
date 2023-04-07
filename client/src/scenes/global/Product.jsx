import React, { useState } from 'react'
import Navbar from '../../components/Navbar.tsx'
import Newsletter from '../../components/Newsletter'
import Footer from '../../components/Footer.tsx'
import { 
  Flex, 
  Text,
  Select,
  Input,
  Button,
  StatLabel
} from '@chakra-ui/react'
import styled from 'styled-components'
import { GrAdd} from 'react-icons/gr';
import { AiOutlineMinus} from 'react-icons/ai';


const Container = styled.div`
`

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
`

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
`

const ImageContainer = styled.div`
  flex: 1;
`

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
`

const Title = styled.h1`
  font-weight: bold;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;

const Amount = styled.span`
  width: 50px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -7px 5px;
`

const ButtonStyled = styled.button`
`

const Product = () => {

  const [ amount, setAmount ] = useState(0);

  const increment = () => {
    setAmount(amount + 1)
  }

  const decrement = () => {
    setAmount(amount - 1)
  }

  return (
    <Container>
      <Navbar />
        <Wrapper>
            <ImageContainer>
              <Image src="https://d3o2e4jr3mxnm3.cloudfront.net/Mens-Jake-Guitar-Vintage-Crusher-Tee_68382_1_lg.png" alt="product" />
            </ImageContainer>
          <InfoContainer>
            <Title>Denim Jumpsuit</Title>
            <Desc>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
              venenatis, dolor in finibus malesuada, lectus ipsum porta nunc, at
              iaculis arcu nisi sed mauris. Nulla fermentum vestibulum ex, eget
              tristique tortor pretium ut. Curabitur elit justo, consequat id
              condimentum ac, volutpat ornare.
            </Desc>
            <Price>$ 20</Price>
          <Flex flexDirection="row" mt="30px">
            <Flex>
              <Select placeholder='Color' width="110px" mt="-3px" ml="5px">
                <option value='option1'>Red</option>
                <option value='option2'>Green</option>
                <option value='option3'>Blue</option>
              </Select>
              
              <Select placeholder='Size' width="110px" mt="-3px" ml="5px">
                <option value='option1'>S</option>
                <option value='option2'>M</option>
                <option value='option3'>L</option>
                <option value='option4'>XL</option>
              </Select>
            </Flex>
          </Flex>
          <Flex margin="10px 0 0 5px" justifyContent="space-between" alignItems="center" width="50%" mt="30px">
            <Flex>
              {/* <Button onClick={decrement}>-</Button> */}
              <AiOutlineMinus onClick={decrement} cursor="pointer" />
              <Amount>{amount}</Amount>
              <GrAdd onClick={increment} cursor="pointer" />
              {/* <Button onClick={increment}>+</Button> */}
            </Flex>
            <Flex>
            </Flex>
              <Button padding="15px" border="2px solid teal" backgroundColor="white" cursor="pointer" fontWeight="500" _hover={{backgroundColor : "#f8f4f4"}} >Add to Cart</Button>
            </Flex>
          </InfoContainer>
        </Wrapper>
      <Newsletter />
      <Footer />
    </Container>
  )
}

export default Product
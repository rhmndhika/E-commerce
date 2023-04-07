import { Flex, Text, Select } from '@chakra-ui/react'
import React from 'react'
import styled from 'styled-components'
import Products from '../../components/Products'
import Newsletter from '../../components/Newsletter'
import Footer from '../../components/Footer.tsx'
import Navbar from '../../components/Navbar.tsx'

const Container = styled.div`
`

const FilterText = styled.span`
  font-size: 20px;
  font-weight: 600;
`

const ProductList = () => {
  return (
    <>
    <Navbar />
    <Flex flexDirection="column" justifyContent="center">
      <Text margin="20px" fontSize="35px" fontWeight="bold">Dressess</Text>
      <Flex flexDirection="row" justifyContent="space-between" alignItems="center" margin="20px">
        <Flex flexDirection="row">
          <FilterText>Filter Products</FilterText>
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

        <Flex>
          <FilterText>Sort Products</FilterText>
          <Select placeholder='Options' width="110px" mt="-3px" ml="5px">
            <option value='option1'>Newest</option>
            <option value='option2'>Price (ASC)</option>
            <option value='option3'>Price (DESC)</option>
          </Select>
        </Flex>
      </Flex>
      <Products />
      <Newsletter />
      <Footer />
    </Flex>
    </>
  )
}

export default ProductList
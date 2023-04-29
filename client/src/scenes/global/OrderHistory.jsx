import React from 'react'
import Order from '../../components/Order'
import Navbar from '../../components/Navbar'
import {
  Container,
 Text
} from '@chakra-ui/react'
import Newsletter from '../../components/Newsletter'
import Footer from '../../components/Footer.tsx'

const OrderHistory = () => {
  return (
    <div>
      <Navbar />
      <Text fontWeight="bold" fontSize="30px" margin="20px">
        Order History
      </Text>
      <Order />
      <Container mt="40px">
        <Newsletter />
      </Container>
      <Footer />
    </div>
  )
}

export default OrderHistory
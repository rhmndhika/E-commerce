import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Flex,
    Container, 
    Text,
    Badge,
    Divider,
    Image
  } from '@chakra-ui/react'
import moment from 'moment'
import { Link } from 'react-router-dom'

const ModalTransaction = ({ data, isOpen, onClose, id }) => {

  const [scrollBehavior, setScrollBehavior] = useState('outside');

  return (
    <Modal scrollBehavior={scrollBehavior} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered id={id}>
    <ModalOverlay />
    <ModalContent maxH="100vh" overflow="auto" overflowWrap="normal">
      <ModalHeader>Detail Transaction</ModalHeader>
      <Divider />
      <ModalCloseButton />
      <ModalBody pb={6}>  
      <Container>
        <Flex flexDirection="column" gap="20px">
          <Flex flexDirection="column" gap="5px" shadow="lg" padding="10px">
             <Flex flexDirection="row" justifyContent="space-between">
                <Text>Status</Text>     
                <Badge><Text>{data?.status}</Text>  </Badge>      
            </Flex>

           <Divider />

            <Flex flexDirection="row" justifyContent="space-between">
                <Text>No. Invoice</Text>     
                <Link to={`/order/history/detail/${data?._id}`} target='_blank'>
                  <Text color="green" cursor="pointer">{data?._id}</Text>        
                </Link>
            </Flex>

            <Flex flexDirection="row" justifyContent="space-between">
                <Text>Purchase Date</Text>     
                <Text> {moment(data?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>        
            </Flex>
          </Flex>   
  
            <Flex flexDirection="column" justifyContent="space-between" shadow="lg" padding="10px"> 
              <Text as="b">Detail Product</Text>
              {data?.products.map((itemDetail) => {
              return (
              <Flex flexDirection="column" mt="10px">
                <Image 
                  boxSize='100px'
                  objectFit='cover'
                  src={itemDetail.productId.img} 
                />
                <Text>{itemDetail.productId.title} </Text>
                <Text>{itemDetail.quantity} x  $ {itemDetail.productId.price}</Text>
              </Flex>
                )
              })}
              <Flex flexDirection="column" mt="20px">
              <Text as="b">Total Price</Text>
              <Text>$ {data?.amount}</Text>
              </Flex>
            </Flex>    

           <Flex flexDirection="column" justifyContent="space-between" shadow="lg" padding="10px"> 
            <Text as="b">Shipping Info</Text>
            <Flex flexDirection="row" justifyContent="space-between" mt="10px">
                <Text>Address</Text>   
                <Flex flexDirection="column">
                  <Text>{data?.address.city}</Text>     
                  <Text>{data?.address.country}</Text>   
                  <Text>{data?.address.postal_code}</Text>    
                  <Text>{data?.address.state}</Text>  
                </Flex>  
            </Flex>
          </Flex>     

           <Flex flexDirection="column" gap="5px" shadow="lg" padding="10px">
            <Text as="b">Payment Details</Text>  
            <Flex flexDirection="row" justifyContent="space-between" mt="10px">
                <Text>Payment Method</Text>     
                <Text>Credit Card</Text>        
            </Flex>

            <Flex flexDirection="row" justifyContent="space-between">
                <Text>Total Price ({data?.products[0].quantity} item)</Text>     
                <Text>$ {data?.amount}</Text>        
            </Flex>

            <Flex flexDirection="row" justifyContent="space-between">
                <Text>Total Shipping Cost (500 gr)</Text>     
                <Text>$ 0</Text>        
            </Flex>

            <Flex flexDirection="row" justifyContent="space-between">
                <Text>Protection Fee</Text>     
                <Text>$ 0</Text>        
            </Flex>
            <Divider />

            <Flex flexDirection="row" justifyContent="space-between">
                <Text as="b">Total Spend</Text>     
                <Text as="b">$ {data?.amount}</Text>        
            </Flex>
          </Flex>       
        </Flex>
      </Container>
      </ModalBody>
      <ModalFooter>
      </ModalFooter>
    </ModalContent>
    </Modal>
  )
}

export default ModalTransaction
import React, { useState, useEffect, useRef } from 'react'
import { 
    Box,
    Container, Flex, Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    FormControl, FormLabel, Grid, GridItem, Heading, Input, useColorModeValue, Center 
} from '@chakra-ui/react'
import { userRequest } from '../../useFetch';
import { useParams } from 'react-router-dom'
import { jsPDF } from "jspdf"
import moment from 'moment'
import Cookies from 'js-cookie';
import Sidebar from '../Sidebar/Sidebar.tsx';

const Invoice = () => {

  const [ userOrder, setUserOrder ] = useState(null);
  const [ userProfile, setUserProfile ] = useState(null);
  const { id } = useParams();
  const [ Prices, setPrices ] = useState(null);
  const tokenUserId = Cookies.get('userId');

  const pdfRef = useRef(null);
  const handleDownload = () => {
    const content = pdfRef.current;
    const doc = new jsPDF("p", "pt" , "a4");
      doc.html(content,  {
      callback: function (doc) {
      doc.save('Document.pdf');
      }
    });
  };

  useEffect(() => {
    const getUserOrder = async () => {
        try{
            const response = await userRequest.get(`/order/single/${id}`)
            setUserOrder(response.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getUserOrder();
  }, [id])

  useEffect(() => {
    const getUserProfile = async () => {
        try{
            const response = await userRequest.get(`/profile/${tokenUserId}`)
            setUserProfile(response.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getUserProfile();
}, [id])


console.log(userOrder)


  return (
    <>
    <Sidebar>
    <Center>
        <Button mt="30px" onClick={handleDownload} colorScheme='teal'>Download</Button>
    </Center>
    { userOrder === null ? <p>Loading...</p> : 
    <Container shadow="lg" ref={pdfRef} >
    <Box p={4}>
    <Heading size="md" mb={4} mt="40px">
    Invoice
    </Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 2fr)" }} gap={6}>
        <GridItem>
            <Box>
            <Text mb={2}>From:</Text>
            <Text fontWeight="bold">PT BUMI BAUREKSA PRATAMA</Text>
            <Text>Jl. Barokah No. 29 Kp. Parungdengdek.</Text>
            <Text>Wanaherang, Gunung Putri, Bogor 16965.</Text>
            <Text>Jawa Barat, Indonesia.</Text>
            <Text>+62 21 867 2756</Text>
            </Box>
        </GridItem>
        { userProfile?.map((profile) => {
          return (
        <GridItem>
            <Box>
            <Text mb={2}>To:</Text>
            <Text fontWeight="bold">{userOrder?.userId.username} / {profile.fullname}</Text>
            <Text>{userOrder?.address.country}</Text>
            <Text>{userOrder?.address.city}, {userOrder?.address.postal_code}</Text>
            <Text>+62 {profile.phoneNumber}</Text>
            </Box>
        </GridItem>
          )
        })}
        <GridItem>
            <Box>
            <Text mb={2}>Invoice Date:</Text>
            <Text fontWeight="bold">May 11, 2023</Text>
            </Box>
        </GridItem>
        </Grid>
        <Table mt={6} size="sm">
        <Thead>
            <Tr>
            <Th>Item</Th>
            <Th>Quantity</Th>
            <Th>Price</Th>
            </Tr>
        </Thead>
        { userOrder.products.map((product) => {
        return (
        <Tbody>
            <Tr>
            <Td>{product.productId.title}</Td>
            <Td>{product.quantity}</Td>
            <Td>$ {product.productId.price}</Td>
            </Tr>
        </Tbody>
          )
        })}
        </Table>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mt={6}>
        <GridItem>
            <FormControl>
            <FormLabel>Notes:</FormLabel>
            <Input />
            </FormControl>
        </GridItem>
        <GridItem>
            <Box  p={4} borderRadius="md">
            <Text mb={2}>Total:</Text>
            <Text fontWeight="bold" fontSize="2xl">$ {userOrder.amount}</Text>
            </Box>
        </GridItem>
        </Grid>
    </Box>
    </Container>
    }
    </Sidebar>
    </>
  )
}

export default Invoice
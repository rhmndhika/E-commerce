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
} from '@chakra-ui/react'
import { userMethod } from '../useFetch'
import { useParams } from 'react-router-dom'
import { jsPDF } from "jspdf"
import moment from 'moment'

const Invoice = () => {

    const [ userOrder, setUserOrder ] = useState(null);
    const { id } = useParams();
    const [ Prices, setPrices ] = useState(null);

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
                const response = await userMethod.get(`/order/single/${id}`)
                setUserOrder(response.data);
            } catch (err) {
                console.log(err);
            } 
        }
        getUserOrder();
    }, [id])

       
  return (
    <>
    <Button mt="30px" justifyContent="center" left="45%" onClick={handleDownload} colorScheme='teal'>Download</Button>
    { userOrder === null ? <p>Loading...</p> : 
    <Container mt="30px" shadow="lg"  maxW='container.sm' centerContent>
        <Flex flexDirection="column" justifyContent="center" alignItems="center" ref={pdfRef}>
        <Flex justifyContent="center" alignItems="center" flexDirection="row">
                <Flex flexDirection="row" justifyContent="space-around" gap="180px">
                    <Flex width="170px">
                        <Box>
                            <Text>Your Company</Text>
                            <Text>Your Name</Text>
                            <Text>Company Address</Text>
                            <Text>City, State, Zip</Text>
                            <Text>Country</Text>
                        </Box>
                    </Flex>
                    <Flex width="150px">
                        <Box>
                            <Text fontSize="40px" fontWeight="bold">INVOICE</Text>
                        </Box>
                    </Flex>
                </Flex>
        </Flex>
        <Flex justifyContent="center" alignItems="center" flexDirection="row">
            <Flex flexDirection="row" justifyContent="space-around"  mt="20px">
                <Flex width="350px">
                    <Box>
                        <Text>Bill To :</Text>
                        <Text>{userOrder.userId}</Text>
                        <Text>{userOrder.address.city}, {userOrder.address.postal_code}</Text>
                        <Text>{userOrder.address.country}</Text>
                    </Box>
                </Flex>
                <Flex width="150px">
                    <Box>
                        <Text>Invoice: {userOrder._id}</Text>
                        <Text>Invoice Date: {moment(userOrder.createdAt).format('MMMM Do YYYY')}</Text>
                    </Box>
                </Flex>
            </Flex>
        </Flex>
        <TableContainer padding="30px">
        <Table variant='simple'>
            <Thead>
            <Tr>
                <Th>Item Description</Th>
                <Th>Quantity</Th>
                <Th>Amount</Th>
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
        </TableContainer>
        <Flex justifyContent="flex-end" alignItems="center" flexDirection="row" padding="10px">
            <Box>
                <Text>Total : $ {userOrder.amount}</Text>
            </Box>
        </Flex>
        </Flex>
   </Container>
   }
   </>
  )
}

export default Invoice
import React, { useState, useEffect, useRef } from 'react'
import { Table, 
    Thead, 
    Tbody, 
    Tr, 
    Th, 
    Td, 
    Flex, 
    Heading, 
    Text, 
    Center, 
    Button, 
    TableContainer, 
    Badge,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    useToast
} from '@chakra-ui/react';
import Sidebar from '../../../components/Sidebar/Sidebar.tsx';
import { useParams } from 'react-router';
import { userRequest } from '../../../useFetch.js';
import Cookies from 'js-cookie';
import moment from 'moment';
import { Link } from 'react-router-dom';

const TransactionDetails = () => {

    const tokenUserId = Cookies.get('userId');
    const { id } = useParams();
    const toast = useToast();
    const [ userOrder, setUserOrder ] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ orderStatus, setOrderStatus ] = useState("");
    
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
    }, [id, tokenUserId])

    const updateorderStatus = async () => {
        try {
            await userRequest.put(`/order/update/${userOrder._id}`, {
                status: orderStatus
            }).then((res) => {
                toast({
                    title: 'Updating Order Status.',
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                  });
                setTimeout(() => window.location.reload(), 2000);
            })
        } catch (err) {
            console.log(err);
        }
    }

    // const pdfRef = useRef(null);
    // const handleDownload = () => {
    //   const content = pdfRef.current;
    //   const doc = new jsPDF("p", "pt" , "a2");
    //     doc.html(content,  {
    //     callback: function (doc) {
    //     doc.save('Document.pdf');
    //     }
    //   });
    // };

  return (
    <Sidebar>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Order Status</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
                <FormLabel>Order Status</FormLabel>
                <Input 
                  defaultValue={userOrder?.status}
                  onChange={(e) => {
                    setOrderStatus(e.target.value);
                  }}
                />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} mr={3}>Cancel</Button>
            <Button colorScheme='blue' onClick={updateorderStatus}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
    <Flex justifyContent="flex-end">
        <Button colorScheme="green" onClick={onOpen}>Update Order Status</Button>
    </Flex>
    <Flex flexDirection="column">
        <Flex flexDirection="column" padding="5px">
            <Heading as='h4' size='md'>Order Information</Heading>
            <Flex flexDirection="row" mt="10px" gap="5px">
              <Text>Order ID: </Text>
              <Link to={`/user/order/${userOrder?._id}/invoice`}>
                <Text color="green">
                  {userOrder?._id}
                </Text>
              </Link>
            </Flex>
            <Text>Order Date: {moment(userOrder?.createdAt).format('MMMM Do YYYY')}</Text>
            { userOrder?.status === "pending" ? 
                <Text>Order Status: 
                    <Badge color="#2a7ade">
                        {userOrder?.status}
                    </Badge>
                </Text>
                :
                <Text>Order Status: 
                    <Badge>
                        {userOrder?.status}
                    </Badge>
                </Text>
                }
            <Text>Customer Name: {userOrder?.userId.username}</Text>
            <Text>Customer Email: {userOrder?.userId.email}</Text>
            <Text>Country: {userOrder?.address.country}</Text>
            <Text>City: {userOrder?.address.city}</Text>
            <Text>Postal Code: {userOrder?.address.postal_code}</Text>
        </Flex>
      
      <Heading as='h4' size='md' mt="20px">Product Table</Heading>
      <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>Product Name</Th>
            <Th>Price</Th>
            <Th>Quantity</Th>
            <Th>Total</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userOrder?.products.map((product) => (
            <Tr key={product.productId._id}>
              <Td>{product.productId.title}</Td>
              <Td>$ {product.productId.price}</Td>
              <Td>{product.quantity}</Td>
              <Td>$ {userOrder?.amount}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      </TableContainer>
    </Flex>
    </Sidebar>
  )
}

export default TransactionDetails
import React, { useState, useEffect } from 'react'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Text,
    Flex,
    Button,
    Badge,
    Container,
    Stack,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    InputGroup,
    InputLeftElement
} from '@chakra-ui/react'
import { userMethod } from '../useFetch'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Cookies from 'js-cookie';
import { BsBag } from 'react-icons/bs'
import moment from 'moment'
import ModalTransaction from './ModalTransaction'
import DatePicker from "react-datepicker";
import { 
    FaSearch
  } from 'react-icons/fa';

const Order = () => {

    
    const tokenUserId = Cookies.get('userId');
    const [ orderHistory, setOrderHistory ] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrderHistory, setFilteredOrderHistory] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


   
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { 
        isOpen: isOpenModalReview, 
        onOpen: onOpenModalReview, 
        onClose: onCloseModalReview 
      } = useDisclosure();

    const [selectedItemId, setSelectedItemId] = useState(null);

    const handleOpenModal = (itemId) => {
        setSelectedItemId(itemId);
        onOpen();
      };
    
      const handleCloseModal = () => {
        setSelectedItemId(null);
        onClose();
      };

      
    useEffect(() => {
        const getOrderHistory = async () => {
            try{
                const response = await userMethod.get(`/order/find/${tokenUserId}`)
                setOrderHistory(response.data);
            } catch (err) {
                console.log(err);
            } 
        }
        getOrderHistory();
    }, [tokenUserId])

    useEffect(() => {
        let filteredOrders = [...orderHistory];
        if (startDate) {
          filteredOrders = filteredOrders.filter(
            (order) => moment(order.createdAt).isSameOrAfter(startDate, 'day')
          );
        }
        if (endDate) {
          filteredOrders = filteredOrders.filter(
            (order) => moment(order.createdAt).isSameOrBefore(endDate, 'day')
          );
        }
        setFilteredOrderHistory(filteredOrders);
      }, [orderHistory, startDate, endDate]);

      const handleStartDateChange = (event) => {
        const date = event.target.value;
        if (date) {
          setStartDate(moment(date));
        } else {
          setStartDate(null);
        }
      };
    
      const handleEndDateChange = (event) => {
        const date = event.target.value;
        if (date) {
          setEndDate(moment(date));
        } else {
          setEndDate(null);
        }
      };
    


  return (
    <>
     <Flex justifyContent="center">
         <Input
          type="date"
          placeholder="Start Date"
          onChange={handleStartDateChange}
        />
        <Input
          type="date"
          placeholder="End Date"
          onChange={handleEndDateChange}
        />
      </Flex>
    {filteredOrderHistory.map((order) => {
    return (
    <Container shadow="lg" maxW='container.lg' borderRadius="10px" overflow="hidden" height="300px" overflowY="auto">
    <ModalTransaction data={selectedItemId} isOpen={isOpen} onOpen={handleOpenModal} onClose={handleCloseModal} id={order._id} />
    <Flex flexDirection="column" justifyContent='center' alignItems="center">
        <Flex flexDirection="row" justifyContent="space-between" alignSelf="flex-start" flexWrap="wrap" mt="40px" width="100%">
            <Flex gap="30px">
                <Stack direction="row">
                    <BsBag />
                    <Text>
                        Shooping
                    </Text>
                </Stack>

                <Text>
                    {moment(order.createdAt).format('MMMM Do YYYY')}
                </Text>

                <Badge>
                    <Text mt="4px">
                    {order.status}
                    </Text>
                </Badge>
            </Flex>

            <Flex gap="10px">
                <Text as="b">Invoice No : </Text> 
                <Link to={`/order/history/detail/${order._id}`} onClick={() => {
                    window.open('/order/history/detail/'+order._id, '_blank');
                }}>
                    <Text cursor="pointer" color="green">{order._id}</Text>
                </Link>
            </Flex>
        </Flex>


        {order.products.map((productItem) => {
            return (
             <>                
            <Flex flexDirection="row" justifyContent="space-between" width="100%" mt="40px" flexWrap="wrap">
                <Image
                    boxSize='100px'
                    objectFit='cover'
                    src={productItem.productId.img}
                    alt='Dan Abramov'
                    fallbackSrc='https://via.placeholder.com/150'
                />
                
                <Flex flexDirection="column" flex="2" ml="10px">
                    <Text fontSize="lg" as="b">
                        {productItem.productId.title}
                    </Text>
                    <Text>
                    {productItem.quantity} x  $ {productItem.productId.price}
                    </Text>
                </Flex>
            </Flex>

            </>
            )
        })}
            <Flex justifyContent="space-between" gap="20px" width="100%" mt="10px">
                <Flex mt="8px" gap="10px">
                    <Text as="b">
                        Total Price
                    </Text>
                    <Text>
                    $ {order.amount}
                    </Text>
                </Flex>

                <Flex gap="20px">
                <Text mt="8px" color='green' cursor="pointer" onClick={() => {
                    handleOpenModal(order)
                }}>See Detail Transaction</Text>
                <Link to={`/user/review/${order._id}`}>
                    <Button colorScheme='green'>Review</Button>
                </Link>
                </Flex>
            </Flex>
    </Flex>
    </Container>
        )
    })}
    </>
  )
}

export default Order
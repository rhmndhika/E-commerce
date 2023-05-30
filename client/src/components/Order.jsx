import React, { useState, useEffect } from 'react'
import {
    Text,
    Flex,
    Button,
    Badge,
    Container,
    Stack,
    Image,
    FormControl,
    useDisclosure,
    InputGroup,
    InputLeftElement,
    Input
} from '@chakra-ui/react'
import { userMethod } from '../useFetch'
import { Link, useParams } from 'react-router-dom'
import Cookies from 'js-cookie';
import { BsBag, BsCalendarHeartFill } from 'react-icons/bs'
import moment from 'moment'
import ModalTransaction from './ModalTransaction'
import DatePicker from "react-datepicker";
import { 
    FaSearch
  } from 'react-icons/fa';

const Order = () => {

    
    const tokenUserId = Cookies.get('userId');
    const [orderHistory, setOrderHistory] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredOrderHistory, setFilteredOrderHistory] = useState([]);


   
    const { isOpen, onOpen, onClose } = useDisclosure();
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
      const filteredOrders = orderHistory.filter((order) => {

        if (!searchText && !startDate && !endDate) {
          return true;
        }
        if (searchText && order._id.includes(searchText)) {
          return true;
        }
        if (startDate && endDate) {
          const orderDate = moment(order.createdAt).startOf('day');
          return orderDate.isSameOrAfter(startDate) && orderDate.isSameOrBefore(endDate);
        }
        return false;
      });
      setFilteredOrderHistory(filteredOrders);
    }, [orderHistory, searchText, startDate, endDate]);

    useEffect(() => {
      if (searchTerm) {
        const filteredOrders = orderHistory.filter((order) => {
          const matchedProducts = order.products.filter((product) =>
            product.productId.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          return matchedProducts.length > 0;
        });
        setFilteredOrderHistory(filteredOrders);
      }      
    }, [orderHistory, searchTerm])
  
    const handleSearch = (event) => {
      setSearchText(event.target.value);
    };

    const handleSearch2 = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleStartDateChange = (date) => {
      setStartDate(date.startOf('day'));
    };
  
    const handleEndDateChange = (date) => {
      setEndDate(date.startOf('day'));
    };

    const handleClearSearch = () => {
      setSearchText('');
      setSearchTerm('');
      setStartDate(null);
      setEndDate(null);
    };
    

  return (
    <>
     <Container>
        <FormControl mb="4">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Search invoice / order id"
            value={searchText}
            onChange={handleSearch}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<FaSearch color="gray.300" />}
          />
          <Input
            type="text"
            placeholder="Search product name"
            value={searchTerm}
            onChange={handleSearch2}
          />  
        </InputGroup>
        </FormControl>
        <FormControl mb="4">
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<BsCalendarHeartFill color="gray.300" />}
            />
            <Input
              type="date"
              placeholder="Start date"
              onChange={(event) => handleStartDateChange(moment(event.target.value))}
            />
            <Input
              type="date"
              placeholder="End date"
              onChange={(event) => handleEndDateChange(moment(event.target.value))}
            />
            </InputGroup>
        </FormControl>
        <Flex justifyContent="center">
          <Button colorScheme='green' width="250px" ml="10px" onClick={handleClearSearch}>Clear Filter</Button>
        </Flex>
      </Container>
      {filteredOrderHistory.length > 0 ? (
        filteredOrderHistory.map((order) => (
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
                      <Link to={`/order/history/detail/${order._id}`} target='_blank'>
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
                       {order.status === "pending" || item.status === "Pending"  ?
                      //  null
                       <Link to={`/user/review/${order._id}`}>
                          <Button colorScheme='green'>Review</Button>
                      </Link>
                       :
                      <Link to={`/user/review/${order._id}`}>
                          <Button colorScheme='green'>Review</Button>
                      </Link>
                      }
                      </Flex>
                  </Flex>
          </Flex>
          </Container> 
        ))
      ) : (
        <Flex justifyContent="center" mt="10px">
          <Text fontSize="2xl" as="b">No orders found.</Text>
        </Flex>
      )}
    </>
  )
}

export default Order


import React, { useState, useEffect } from 'react'
import {
    Text,
    Flex,
    Button,
    Container,
    Image,
    Divider,
    HStack,
    IconButton,
    InputGroup, 
    Input,
    FormControl,
    InputLeftElement
} from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import { userRequest } from '../../../useFetch'
import { StarIcon } from "@chakra-ui/icons"
import Sidebar from '../../../components/Sidebar/Sidebar.tsx'
import Cookies from 'js-cookie';
import { 
    FaSearch
} from 'react-icons/fa';
import { BsBag, BsCalendarHeartFill } from 'react-icons/bs'

const ReviewList = () => {

    const tokenUserId = Cookies.get('userId');
    const [ reviewList, setReviewList ] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [filteredReviewHistory, setFilteredReviewHistory] = useState([]);


    useEffect(() => {
        const getReviewList = async () => {
            try{
                const response = await userRequest.get(`/product/getreview`)
                setReviewList(response.data);
            } catch (err) {
                console.log(err);
            } 
        }
        getReviewList();
    }, [tokenUserId])

    useEffect(() => {
        const filteredOrders = reviewList.filter((review) => {
            if (!searchText && !startDate && !endDate) {
              return true;
            }
            if (searchText && review?.order?._id.includes(searchText)) {
                return true;
              }
            if (startDate && endDate) {
              const reviewDate = moment(review.order?.createdAt).startOf('day');
              return reviewDate.isSameOrAfter(startDate) && reviewDate.isSameOrBefore(endDate);
            }
            return false;
          });
          setFilteredReviewHistory(filteredOrders);
      }, [reviewList, searchText, startDate, endDate]);
  
      useEffect(() => {
        if (searchTerm) {
          const filteredOrders = reviewList.filter((review) => {
            let matchedProducts = [];
            if (Array.isArray(review.product)) {
              matchedProducts = review.product.filter((productz) =>
                productz.title.toLowerCase().includes(searchTerm.toLowerCase())
              );
            } else if (review.product && typeof review.product === 'object') {
              const tempProduct = [review.product];
              matchedProducts = tempProduct.filter((productz) =>
                productz.title.toLowerCase().includes(searchTerm.toLowerCase())
              );
            }
            return matchedProducts.length > 0;
          });
          setFilteredReviewHistory(filteredOrders);
        }      
      }, [reviewList, searchTerm]);
      
    
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
        const dateInputs = document.querySelectorAll('input[type="date"]');
        dateInputs.forEach((input) => {
          input.value = '';
        });
      };
      
      
      
    
      return (
        <Sidebar>
          <Text fontWeight="bold" fontSize="30px" margin="20px">
            Review History
          </Text>
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
                  onChange={(event) =>
                    handleStartDateChange(moment(event.target.value))
                  }
                />
                <Input
                  type="date"
                  placeholder="End date"
                  onChange={(event) =>
                    handleEndDateChange(moment(event.target.value))
                  }
                />
              </InputGroup>
            </FormControl>
            <Flex justifyContent="center">
              <Button
                colorScheme="green"
                width="250px"
                ml="10px"
                onClick={handleClearSearch}
              >
                Clear Filter
              </Button>
            </Flex>
          </Container>
          {filteredReviewHistory.length > 0 ? (
            filteredReviewHistory.map((listItem) => (
              <Container
                key={listItem._id}
                shadow="lg"
                maxW="container.sm"
                borderRadius="10px"
                overflow="hidden"
                height="270px"
                overflowY="auto"
                mb="20px"
              >
                <Flex flexDirection="column" justifyContent="center" alignItems="center">
                  <Flex justifyContent="space-between" width="100%" gap="30px" flexWrap="wrap" mt="20px">
                    <Link to={`/order/history/detail/${listItem.order?._id}`} target="_blank">
                      <Text alignSelf="flex-start" mt="10px" color="green" cursor="pointer">
                        {listItem?.order?._id}
                      </Text>
                    </Link>
      
                    <Text alignSelf="flex-start" mt="10px">
                      <Text as="b">Order received :</Text>{" "}
                      {moment(listItem.order?.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </Text>
                  </Flex>
                  <Divider />
      
                  <Flex flexDirection="row" justifyContent="space-between" width="100%" mt="20px" flexWrap="wrap">
                    <Image
                      boxSize="100px"
                      objectFit="cover"
                      src={listItem.product?.img}
                      alt="Dan Abramov"
                      fallbackSrc="https://via.placeholder.com/150"
                    />
                    <Flex flexDirection="column" flex="2" ml="10px">
                      <Text fontSize="lg" as="b">
                        {listItem.product?.title}
                      </Text>
                      <HStack spacing="1">
                        {[...Array(5)].map((_, i) => (
                          <IconButton
                            key={i}
                            icon={<StarIcon color={i < listItem?.rating ? "yellow.500" : "gray.200"} />}
                            aria-label={`rating ${i}`}
                          />
                        ))}
                        <Text>{listItem?.rating} out of 5 stars</Text>
                      </HStack>
                    </Flex>
                  </Flex>
      
                  <Flex justifyContent="space-between" gap="20px" width="100%" mt="10px">
                    <Flex mt="8px" gap="10px"></Flex>
      
                    <Flex gap="20px">
                      <Link to={`/reviewList/${listItem._id}`}>
                        <Button colorScheme="green">See Review</Button>
                      </Link>
                    </Flex>
                  </Flex>
                </Flex>
              </Container>
            ))
          ) : (
            <Flex justifyContent="center" mt="10px">
              <Text fontSize="2xl" as="b">
                No reviews found.
              </Text>
            </Flex>
          )}
        </Sidebar>
      );      
}

export default ReviewList
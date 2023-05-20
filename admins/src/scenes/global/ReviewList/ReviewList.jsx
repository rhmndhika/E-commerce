import React, { useState, useEffect } from 'react'
import {
    Text,
    Flex,
    Button,
    Container,
    Image,
    Divider,
    HStack,
    IconButton
} from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import { userRequest } from '../../../useFetch'
import { StarIcon } from "@chakra-ui/icons"
import Sidebar from '../../../components/Sidebar/Sidebar.tsx'
import Cookies from 'js-cookie';

const ReviewList = () => {

    const tokenUserId = Cookies.get('userId');
    const [ reviewList, setReviewList ] = useState([]);

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

    console.log(reviewList)
    
  return (
    <Sidebar>
<Text fontWeight="bold" fontSize="30px" margin="20px">
        Review History
    </Text>
    { reviewList?.map((listItem) => {
    return (
    <Container shadow="lg" maxW='container.sm' borderRadius="10px" overflow="hidden" height="270px" overflowY="auto" mb="20px">
    <Flex flexDirection="column" justifyContent='center' alignItems="center">
        <Flex justifyContent="space-between" width="100%" gap="30px" flexWrap="wrap" mt="20px">
          <Link to={`/order/history/detail/${listItem.order?._id}`} onClick={() => {
                    window.open('/order/history/detail/'+listItem.order?._id, '_blank');
                }}>
            <Text alignSelf="flex-start" mt="10px" color="green" cursor="pointer">
                {listItem?.order?._id}
            </Text>
          </Link>

          <Text alignSelf="flex-start" mt="10px">
              <Text as="b">Order received :</Text> {moment(listItem.order?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
          </Text>
        </Flex>
        <Divider />    

            <Flex flexDirection="row" justifyContent="space-between" width="100%" mt="20px" flexWrap="wrap">
                <Image
                    boxSize='100px'
                    objectFit='cover'
                    src={listItem.product?.img}
                    alt='Dan Abramov'
                    fallbackSrc='https://via.placeholder.com/150'
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
                <Flex mt="8px" gap="10px">
                   
                </Flex>

                <Flex gap="20px">
                <Link to={`/reviewList/${listItem._id}`}>
                    <Button colorScheme='green'>See Review</Button>
                </Link>
                </Flex>
            </Flex>
    </Flex>
    </Container>
         )
    })} 
    </Sidebar>
  )
}

export default ReviewList
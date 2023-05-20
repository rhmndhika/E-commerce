import React, { useState, useEffect } from 'react'
import {
  Flex,
  Container, 
  Text,
  Image,
  HStack,
  IconButton,
  Textarea,
  Box,
  SimpleGrid
} from '@chakra-ui/react'
import { StarIcon, CloseIcon, AddIcon } from "@chakra-ui/icons"
import { useParams } from 'react-router'
import moment from 'moment'
import Cookies from 'js-cookie';
import { userRequest } from '../../useFetch'
import Sidebar from '../Sidebar/Sidebar.tsx'

const Reviewed = () => {
    
    const tokenUserId = Cookies.get('userId');
    const { id } = useParams();
    const [ images, setImages ] = useState([]);
    const [ rating, setRating ] = useState(0);
    const [ productReviewed, setProductReviewed ] = useState(null);

    useEffect(() => {
        const getProductReviewed = async () => {
            try{
                const response = await userRequest.get(`/products/reviewed/${id}`)
                setProductReviewed(response?.data);
            } catch (err) {
                console.log(err);
            } 
        }
        getProductReviewed();
      }, [id])
    
      const total = productReviewed?.order?.products[0].quantity * productReviewed?.product?.price

  return (
    <Sidebar>
    <Text fontWeight="bold" fontSize="30px" margin="20px">
        Reviewed Product
    </Text>
    <Container shadow="lg" mt="30px" mb="50px" padding="10px">
      <Flex flexDirection="column" gap="20px" alignItems="center">
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Text as="b">PT BUMI BAUREKSA PRATAMA </Text>
          <Text>{moment(productReviewed?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
        </Flex>
        <>
          <Flex flexDirection="row" gap="10px" width="100%">
            <Flex flexDirection="column" gap="10px" flexWrap="wrap">
            <Image
              boxSize='100px'
              objectFit='cover'
              src={productReviewed?.product.img}
              alt='Dan Abramov'
            />
              <Text as="b">{productReviewed?.product.title}</Text>

              <Text>Rating</Text>
              <Flex flexDirection="column" >
                <HStack spacing="1">
                  {[...Array(5)].map((_, i) => (
                    <IconButton
                      key={i}
                      icon={<StarIcon color={i < productReviewed?.rating ? "yellow.500" : "gray.200"} />}
                      aria-label={`rating ${i}`}
                    />
                  ))}
                  <Text>{productReviewed?.rating} out of 5 stars</Text>
                </HStack>
                <Text>Review</Text>
                <Flex width="100%">
                  <Textarea placeholder='Tulis deskripsi Anda mengenai produk ini' value={productReviewed?.comment} />
                </Flex>

                <Box py={6}>
                <Text>Products Pictures</Text>
                <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} spacing={6} mt={1}>
                {productReviewed?.img.map((imageUrl, index) => (
                  <Image key={index} src={imageUrl} alt={`Image ${index + 1}`} />
                ))}
                </SimpleGrid>
                </Box>

              </Flex>
            </Flex>
          </Flex>
        </>
          {/* )
        })}  */}
      </Flex>
    </Container>
    </Sidebar>
  )
}

export default Reviewed
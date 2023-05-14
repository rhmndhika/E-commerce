import React, { useState, useEffect } from 'react'
import {
  Button,
  Flex,
  Container, 
  Text,
  Image,
  HStack,
  IconButton,
  Textarea,
  Input,
  Box,
  FormControl,
  FormLabel,
  useToast,
  SimpleGrid
} from '@chakra-ui/react'
import { StarIcon, CloseIcon, AddIcon } from "@chakra-ui/icons"
import { useParams } from 'react-router'
import moment from 'moment'
import Cookies from 'js-cookie';
import { userMethod } from '../useFetch'
import Navbar from './Navbar'
import Footer from './Footer.tsx'

const Reviewed = () => {
  
  const tokenUserId = Cookies.get('userId');
  const { id } = useParams();
  const [ images, setImages ] = useState([]);
  const [ rating, setRating ] = useState(0);
  const [ productReviewed, setProductReviewed ] = useState(null);

  useEffect(() => {
    const getProductReviewed = async () => {
        try{
            const response = await userMethod.get(`/products/reviewed/${id}`)
            setProductReviewed(response?.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getProductReviewed();
  }, [id])

  const total = productReviewed?.order?.products[0].quantity * productReviewed?.product?.price


  return (
    <>
    <Navbar />
    <Text fontWeight="bold" fontSize="30px" margin="20px">
        Reviewed Product
    </Text>
    <Container shadow="lg" mt="30px" mb="50px" padding="10px">
      <Flex flexDirection="column" gap="20px" alignItems="center">
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Text as="b">PT BUMI BAUREKSA PRATAMA </Text>
          <Text>{moment(productReviewed?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
        </Flex>
        {/* {userOrder?.products.map((item) => {
        const total = item.quantity * item.productId.price
        return (  */}
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
              {/* <Text>quantity item x  $ price</Text> */}
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
                {/* <Text>Bagikan foto-foto dari produk yang Anda terima</Text> */}

                <Box py={6}>
                <Text>Foto-foto</Text>
                <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} spacing={6} mt={1}>
                {productReviewed?.img.map((imageUrl, index) => (
                  <Image key={index} src={imageUrl} alt={`Image ${index + 1}`} />
                ))}
                  {/* {images.map((image, index) => (
                    <Box key={index} position="relative">
                      <Image src={image} boxSize="100px" objectFit="cover" />
                      <IconButton
                        aria-label="Remove image"
                        icon={<CloseIcon />}
                        colorScheme="red"
                        position="absolute"
                        top={0}
                        right={0}
                        size="sm"
                      />
                    </Box>
                  ))} */}

                  {/* { images.length < 8 && (
                    <Box
                      borderWidth="1px"
                      borderColor="gray.300"
                      borderStyle="dashed"
                      borderRadius="md"
                      p={4}
                      textAlign="center"
                      cursor="pointer"
                      onClick={() => document.getElementById("input-images").click()}
                    >
                      <AddIcon mb={2} />
                      Add more images
                    </Box>
                  )} */}
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
    <Footer />
    </>
  )
}

export default Reviewed
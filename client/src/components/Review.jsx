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
import { publicRequest, userMethod } from '../useFetch'
import moment from 'moment'
import Cookies from 'js-cookie';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../firebase"

const Review = () => {

  const tokenUserId = Cookies.get('userId');
  const { id } = useParams();
  const [ rating, setRating ] = useState(0);
  const [ comment, setComment ] = useState('');
  const [ images, setImages ] = useState([]);
  const [ userOrder, setUserOrder ] = useState(null);
  const [ userReview, setUserReview ] = useState(null);
  const toast = useToast();
  const [ file, setFile ] = useState([]);


  useEffect(() => {
    const getUserOrder= async () => {
        try{
            const response = await userMethod.get(`/order/single/${id}`)
            setUserOrder(response?.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getUserOrder();
  }, [id])


  useEffect(() => {
    const getUserReview = async () => {
        try{
            const response = await userMethod.get(`/products/${tokenUserId}/reviews`)
            setUserReview(response?.data);
        } catch (err) {
            console.log(err);
        } 
    }
    getUserReview();
  }, [id])

  
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages([...urls]);
  };

  console.log(file)
  

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };


  const handleSubmit = async (productId) => {
    const downloadURLs = [];
  
    for (let i = 0; i < file.length; i++) {
      const currentFile = file[i];
      const fileName = new Date().getTime() + currentFile.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, currentFile);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track upload progress if needed
        },
        (error) => {
          console.error("Upload error:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          downloadURLs.push(downloadURL);
  
          if (downloadURLs.length === file.length) {
            // All images have been uploaded and download URLs are available
            try {
              userMethod.post("/product/review", {
                user: tokenUserId,
                product: productId,
                order: id,
                rating,
                comment,
                img: downloadURLs
              }).then((res) => {
                toast({
                  title: "Review Sent",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                setTimeout(() => {
                  window.location.reload();
                }, 1500);
              });
            } catch (err) {
              console.log(err);
            }
          }
        }
      );
    }
  };
  
  

  const handleRatingClick = (value) => {
    setRating(value);
  };

 
  return (
    <Container shadow="lg" mt="30px" mb="50px" padding="10px">
      <Flex flexDirection="column" gap="20px" alignItems="center">
        <Flex flexDirection="row" justifyContent="space-between" width="100%">
          <Text as="b">PT BUMI BAUREKSA PRATAMA </Text>
          <Text>{moment(userOrder?.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
        </Flex>
        {userOrder?.products.map((item) => {
        const total = item.quantity * item.productId.price
        return ( 
        <>
          <Flex flexDirection="row" gap="10px" width="100%">
            <Flex flexDirection="column" gap="10px" flexWrap="wrap">
            <Image
              boxSize='100px'
              objectFit='cover'
              src={item.productId.img}
              alt='Dan Abramov'
            />
              <Text as="b">{item.productId.title}</Text>
              <Text>{item.quantity} item x  $ {item.productId.price}</Text>
              <Text as="b">Total Spend : $ {total}</Text>
              {userReview?.some(review => review.product._id === item.productId._id && review.order._id === userOrder._id)
              ?              
              <Text>Reviewed</Text>
              :
              <Flex flexDirection="column">
                <HStack spacing="1">
                  {[...Array(5)].map((_, i) => (
                    <IconButton
                      key={i}
                      icon={<StarIcon color={i < rating? "yellow.500" : "gray.200"} />}
                      aria-label={`rating ${i}`}
                      onClick={() => handleRatingClick(i + 1)}
                    />
                  ))}
                  <Text>{rating} out of 5 stars</Text>
                </HStack>
                <Text mt="10px">Leave a review for this product</Text>
                <Textarea placeholder='Write your review about this product' onChange={(e) => {
                  setComment(e.target.value);
                }} />
                <Text>Share photos of the products you receive</Text>

                <Box py={6}>
                  <FormControl>
                    <FormLabel>Select images to upload:</FormLabel>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      // onChange={handleImageChange}
                      onChange={(e) => setFile(e.target.files)}
                    />
                  </FormControl>
                <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} spacing={6} mt={6}>
                  {images.map((image, index) => (
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
                        onClick={() => handleRemoveImage(index)}
                      />
                    </Box>
                  ))}
                </SimpleGrid>

                  {/* <Input
                    id="input-images"
                    type="file"
                    multiple
                    accept="image/*"
                    display="none"
                    onChange={handleImageChange}
                  /> */}
                </Box>
                
                <Flex flexDirection="row" alignSelf="flex-end" gap="15px" padding="10px">
                  <Button as="a" href="/order/history" width="150px" variant="outline">Cancel</Button>
                  <Button type="submit" width="150px" variant="solid" colorScheme='teal' onClick={() => {
                    handleSubmit(item.productId._id)
                  }}>Send</Button>
                </Flex>
              </Flex>
              }
            </Flex>
          </Flex>
        </>
          )
        })} 
      </Flex>
    </Container>
  )
}

export default Review
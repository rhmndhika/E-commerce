import React, { useState, useEffect} from 'react'
import {
    Flex,
    Box,
    Image,
    Badge,
    Icon,
    chakra,
    Tooltip,
    Text,
    Stack,
    Heading,
    Button,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    SimpleGrid
  } from '@chakra-ui/react';
import { FiShoppingCart } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { userMethod } from '../useFetch';
import { SearchIcon } from '@chakra-ui/icons';
import { BsBagHeartFill, BsHeartFill } from 'react-icons/bs';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
              

const Wishlist = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);
  // const user = useSelector((state) => state.user.currentUser);
  const tokenUserId = Cookies.get('userId');

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await userMethod.get(`/wishlist/user/${tokenUserId}`);
        setWishlistItems(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, []);

  const deleteWishlistItem = async (id) => {
    try {
      await userMethod.delete(`/wishlist/delete/${tokenUserId}/${id}`).then((res) => {
        toast.success(res.data, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000)
      });
    } catch (err) {
      toast.error(err.response.data, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const filteredItems = wishlistItems.filter((rProduct) => {
    const items = rProduct.products.filter((item) =>
      item?.productId.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return items.length > 0;
  });

  return (
    <Box w="100%" p="3" mt="20px">
      <ToastContainer />
      <Flex mb="6" justifyContent="space-between" flexDirection="row" flexWrap="wrap">
        <Flex flexDirection="column" padding="10px">
          <Heading as="h1" fontSize="2xl" mb="6">
            All Wishlist
          </Heading>
          <Text fontSize="lg">Find your saved items and get ready to order them</Text>
        </Flex>
        <Flex mt="10px">
          <InputGroup>
            <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
            <Input
              type="text"
              placeholder="Search products..."
              width="200px"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </InputGroup>
          <Button colorScheme="teal">Filter</Button>
        </Flex>
      </Flex>
      <Flex flexDirection="row" alignItems="center" flexWrap="wrap" justifyContent="center">
        {filteredItems.length > 0 ? (
          filteredItems.map((rProduct) => {
            return (
              <>
                {rProduct.products
                  .filter((item) =>
                    item.productId.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((item) => {
                    return (
                    <Box
                      key={item.productId._id}
                      width="300px"
                      borderWidth="1px"
                      rounded="lg"
                      shadow="lg"
                      margin="10px"
                      position="relative"
                    >
                      <a href={`/productSingle/${item.productId._id}`}>
                        <Image
                          src={item.productId.img}
                          alt={`Picture of`}
                          roundedTop="lg"
                          objectFit="cover"
                          height="250px"
                        />
                      </a>
                      <Box p="6">
                        <Box alignItems="baseline">
                        </Box>
                        <Flex mt="1" justifyContent="space-between" alignContent="center">
                          <Stack spacing='3'>
                            <Tooltip label={item.productId.title}>
                              <Heading size='md' noOfLines={1} cursor="pointer">{item.productId.title}</Heading>
                            </Tooltip>
                            <Tooltip label={item.productId.desc}>
                              <Text fontSize='xl' noOfLines={[1]} cursor="pointer">
                                {item.productId.desc}
                              </Text>
                            </Tooltip>
                            <Text color='blue.600' fontSize='2xl'>
                              $ {item.productId.price}
                            </Text>
                          </Stack>
                        </Flex>
                        <Flex justifyContent="space-between" mt="5px">
                        <Tooltip
                            label="Favorite"
                            bg="white"
                            placement={'top'}
                            color={'gray.800'}
                            fontSize={'1.2em'}>
                            <chakra.a href={'#'} display={'flex'}>
                              <Icon as={BsHeartFill} h={7} w={7} alignSelf={'center'} 
                                onClick={() => deleteWishlistItem(item.productId._id)} />
                            </chakra.a>
                          </Tooltip>
                          <Tooltip
                            label="Add to cart"
                            bg="white"
                            placement={'top'}
                            color={'gray.800'}
                            fontSize={'1.2em'}>
                            <chakra.a href={'#'} display={'flex'}>
                              <Icon as={FiShoppingCart} h={7} w={7} alignSelf={'center'} />
                            </chakra.a>
                          </Tooltip>
                        </Flex>
                      </Box>
                    </Box>
                    );
                  })}
              </>
            );
          }
          )
        ) : (
          <Text>No items found</Text>
        )}
      </Flex>
    </Box>
    
  )}

  export default Wishlist
import React, { useState, useEffect} from 'react'
import {
    Flex,
    Circle,
    Box,
    Image,
    Badge,
    useColorModeValue,
    Icon,
    chakra,
    Tooltip,
  } from '@chakra-ui/react';
  import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';
  import { FiShoppingCart } from 'react-icons/fi';
  import axios from 'axios'
  import { Link } from 'react-router-dom'

  const data = {
    isNew: true,
    imageURL:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=4600&q=80',
    name: 'Wayfarer Classic',
    price: 4.5,
    rating: 4.2,
    numReviews: 34,
  };
  
  interface RatingProps {
    rating: number;
    numReviews: number;
  }

  function RelatedProduct() {

    const [ products, setProducts ] = useState<any[]>([]);

    useEffect(() => {
        const getProducts = async () => {
          try {
            const response = await axios.get("https://e-commerce-production-25ef.up.railway.app/product/all");
            setProducts(response.data);
          }catch(err) {
            console.log(err);
          }
        };
        getProducts();
      }, [])

    return (
      <Flex flexDirection="row" justifyContent="center" alignItems="center" flexWrap="wrap">
         { products.slice(0,4).map((rProduct) => {
          return (
        <Box
          width="300px"
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          margin="10px"
          position="relative">
          {data.isNew && (
            <Circle
              size="10px"
              position="absolute"
              top={2}
              right={2}
              bg="red.200"
            />
          )}

          <a href={`/productSingle/${rProduct._id}`}>
            <Image
              src={rProduct.img}
              alt={`Picture of`}
              roundedTop="lg"
              objectFit="cover"
              height="250px"              
              />
          </a>
  
          <Box p="6">
            <Box alignItems="baseline">
              {data.isNew && (
                <Badge rounded="full" px="2" fontSize="0.8em" colorScheme="red">
                  {rProduct.categories}
                </Badge>
              )}
            </Box>
            <Flex mt="1" justifyContent="space-between" alignContent="center">
              <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated>
                {rProduct.title}
              </Box>
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
         )
        })}
      </Flex>
    );
  }
  
  export default RelatedProduct;

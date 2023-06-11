import React from 'react';
import { Flex, Text,
  Card, CardHeader, CardBody, CardFooter,
  Stack,
  Heading,
  Divider,
  ButtonGroup,
  Button,
  Image,
  Tooltip
} from '@chakra-ui/react';
import { 
  AiOutlineShoppingCart,
  AiOutlineSearch,
  AiOutlineHeart
} from 'react-icons/ai';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init();

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;

const Circle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
`;

// const Image = styled.img`
//   height: 75%;
//   z-index: 2;
// `;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  &:hover {
    background-color: #e9f5f5;
    transform: scale(1.1);
  }
`;

const Container = styled.div`
  flex: 1;
  margin: 5px;
  min-width: 280px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;
  &:hover ${Info}{
    opacity: 1;
  }
`;

const Product = ({item}) => {

  return (
    <Flex margin="10px" justifyContent="center" alignItems="center" height="460px"
      data-aos="fade-zoom-in"
      data-aos-easing="ease-in-back"
      data-aos-delay="300"
      data-aos-offset="0">  
      <Card maxW='sm'>
      <CardBody>
        <Link to={`/productSingle/${item._id}`}>
        <Image
          src={item.img}
          alt='Green double couch with wooden legs'
          borderRadius='lg'
          objectFit="cover"
          height="250px"
          width="300px"
          cursor="pointer"
          />
        </Link>
        <Stack mt='6' spacing='3'>
          <Tooltip label={item.title}>
            <Heading size='md' noOfLines={1} cursor="pointer">{item.title}</Heading>
          </Tooltip>
          <Text color='blue.600' fontSize='2xl'>
            $ {item.price}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      <CardFooter>
        <Stack>
          <Tooltip label={item.desc}>
            <Text noOfLines={1} maxW="300px" cursor="pointer">{item.desc}</Text>
          </Tooltip>
        </Stack>
      </CardFooter>
      </Card>
    </Flex>
  )
}

export default Product
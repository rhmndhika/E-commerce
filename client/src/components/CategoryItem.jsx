import React from 'react'
import { Flex, Text, Button, 
  Center,
  Card,
  Stack,
  CardBody,
  Heading,
  CardFooter,
  Image, 
  Container
} from '@chakra-ui/react'
import styled from 'styled-components'
import { mobile, isMobile } from '../reponsive'

// const Container = styled.div`
//   flex: 1;
//   margin: 3px;
//   height: 70vh;
//   position: relative;
//   display: flex;
// `;

// const Image = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   ${isMobile({ height: "20vh", padding: "10px"})}
// `;

// const Info = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
// `;

// const Title = styled.h1`
//     color:black;
//     font-weight: bold;
//     margin-bottom: 20px;
// `;

const CategoryItem = ({item}) => {
  return (
  <Container>
    <Card
      direction={{ base: 'column', sm: 'row' }}
      overflow='hidden'
      variant='outline'
      shadow="lg"
    >
      <Image
        objectFit='cover'
        maxW={{ base: '100%', sm: '200px' }}
        src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
        alt='Caffe Latte'
      />

      <Stack>
        <CardBody>
          <Heading size='md'>{item.title}</Heading>

          <Text py='2'>
            Caffè latte is a coffee beverage of Italian origin made with espresso
            and steamed milk.
          </Text>
        </CardBody>

        <CardFooter>
          <Button as="a" href={`/productList/${item.cat}`} variant='solid' colorScheme='blue'>
            Info
          </Button>
        </CardFooter>
      </Stack>
    </Card>
    </Container>
  )
}

export default CategoryItem
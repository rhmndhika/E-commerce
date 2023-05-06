import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar.jsx'
import Newsletter from '../../components/Newsletter'
import Footer from '../../components/Footer.tsx'
import { 
  Flex, 
  Text,
  Select,
  Input,
  Button,
  StatLabel,
  Tabs, TabList, TabPanels, Tab, TabPanel 
} from '@chakra-ui/react'
import styled from 'styled-components'
import { GrAdd} from 'react-icons/gr';
import { AiOutlineMinus} from 'react-icons/ai';
import { mobile, isMobile, isTablet } from '../../reponsive'
import { useMediaQuery } from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { publicRequest } from '../../useFetch.js'
import { addProduct } from '../../redux/cartRedux.js'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart  } from '../../redux/apiCalls.js'
import RelatedProduct from '../../components/RelatedProduct.tsx'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Container = styled.div`
`

const Wrapper = styled.div`
  padding: 50px;
  display: flex;
  ${isTablet({ padding: "10px", flexDirection: "column"})}
`

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: cover;
  ${isTablet({ height: "40%"})}
`

const ImageContainer = styled.div`
  flex: 1;
`

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  ${isTablet({ padding: "10px"})}
`

const Title = styled.h1`
  font-weight: bold;
`;

const Desc = styled.p`
  margin: 20px 0px;
`;

const Price = styled.span`
  font-weight: 100;
  font-size: 40px;
`;

const Amount = styled.span`
  width: 50px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -7px 5px;
`

const ButtonStyled = styled.button`
`

const Product = () => {

  const [ isSmallerThan704 ] = useMediaQuery('(min-width: 704px)', {
    ssr: true,
    fallback: false, 
  })

  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [ product, setProduct ] = useState({});
  const [ quantity, setQuantity ] = useState(1);
  const user = useSelector((state) => state.user?.currentUser?._id);
  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await publicRequest.get("/product/find/"+id);
        setProduct(res.data);
      } catch(err) {
        
      }
    }
    getProduct();
  }, [id])


  const handleClick = () => {
    //update cart
    notify();
    addToCart(dispatch, ({ ...product, quantity, user }))
  }

  const increment = () => {
    setQuantity(quantity + 1)
  }

  const decrement = () => {
    quantity > 1 && setQuantity(quantity - 1)
  }

  const notify = () => {
    toast.success('Added to Cart', {
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

  return (
    <Container>
      <Navbar />
      <ToastContainer />
        <Wrapper>
            <ImageContainer>
              <Image src={product.img} alt="product" />
            </ImageContainer>
          <InfoContainer>
            <Title>{product.title}</Title>
            <Desc>
             <Tabs isFitted variant='enclosed' defaultIndex={0}>
              <TabList mb='1em'>
                <Tab>Description</Tab>
                <Tab>Benefits</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {product.desc}
                </TabPanel>
                <TabPanel>
                  {/* {product.benefits} */}
                  Benefits
                </TabPanel>
              </TabPanels>
            </Tabs>
            </Desc>
            <Price>$ {product.price}</Price>
          <Flex margin="10px 0 0 5px" justifyContent="space-between" alignItems="center"  mt="30px">
            <Flex>
              <AiOutlineMinus onClick={decrement} cursor="pointer" />
              <Amount>{quantity}</Amount>
              <GrAdd onClick={increment} cursor="pointer" />
            </Flex>
          
          { user ? 
            <Flex>
              <Button padding="15px" border="2px solid teal" backgroundColor="white" cursor="pointer" fontWeight="500" _hover={{backgroundColor : "#f8f4f4"}} 
              onClick={handleClick}>Add to Cart</Button>
            </Flex>
            :
            null
          }
          
            </Flex>
          </InfoContainer>
        </Wrapper>
      <Text ml="30px" fontSize="20px" fontWeight="bold">Related Product </Text>
      <RelatedProduct />
      <Newsletter />
      <Footer />
    </Container>
  )
}

export default Product
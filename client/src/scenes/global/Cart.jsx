import React, { useEffect } from 'react'
import styled from 'styled-components'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.tsx'
import { GrAdd} from 'react-icons/gr'
import { AiOutlineMinus} from 'react-icons/ai'
import { isMobile620, isTablet860 } from '../../reponsive'
import { useDispatch, useSelector } from 'react-redux'
import StripeCheckout from 'react-stripe-checkout'
import { useState } from 'react'
import { userMethod } from '../../useFetch.js'
import { Link, useNavigate } from 'react-router-dom'
import { removeCartItem } from '../../redux/apiCalls.js'
import { cartProductsSelector, cartQuantitySelector, cartTotalSelector, decreaseCartItemQuantity, getCartTotal, increaseCartItemQuantity, removeItem } from '../../redux/cartRedux.js'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';
import { Flex, Text, Tooltip } from '@chakra-ui/react'

const KEY =  "pk_test_51MuV3GECvrLW1LL9pTqGJ5eCINrDmbC81kIycSRw70xvBPx6KDHspuAxibLSQGprMc2TJzFKaRgowk8JwhMd7K6I00oOGcoFW4"

const Container = styled.div``

const Wrapper = styled.div`
    padding: 20px;
    ${isTablet860({ padding: "10px"})}
`
const Title = styled.h1`
    font-weight: 300;
    text-align: center;
    font-size: 30px;
`
const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
`

const TopButton = styled.button`
    padding: 10px;
    font-weight: 600;
    cursor: pointer;
    border: ${(props) => props.type === "filled" && "none"};
    background-color: ${(props) =>
        props.type === "filled" ? "#319795" : "transparent"};
    color: ${(props) => props.type === "filled" && "white"};
    border-radius: 5px;
`
const TopTexts = styled.div`
    ${isTablet860({ display: "none"})}
`

const TopText = styled.span`
    text-decoration: underline;
    cursor: pointer;
    margin: 0px 10px;
`

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    ${isTablet860({ flexDirection: "column"})}
`

const Info = styled.div`
    flex: 3;
`

const Product = styled.div`
    display: flex;
    justify-content: space-between;
    ${isMobile620({ flexDirection: "column"})}
`

const ProductDetail = styled.div`
    flex: 2;
    display: flex;
`

const Image = styled.img`
    width: 200px;
`

const Details = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px; 
    gap: 10px;
    margin-top: 10px;
`
const ProductName = styled.span``

const ProductId = styled.span``

const ProductColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${(props)=> props.color};
`
const ProductSize = styled.span``

const PriceDetail = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const ProductAmountContainer = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`
const ProductAmount = styled.div`
    font-size: 24px;
    margin: 5px;
    padding: 5px 15px;
    ${isMobile620({ padding: "5px 15px"})}
`
const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
    ${isMobile620({ marginBottom: "20px"})}
`

const Hr = styled.hr`
    background-color: #eee;
    border: none;
    height: 1px;
`

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 150px;
  padding: 10px;
  background-color: #319795;
  color: white;
  font-weight: 600;
  border-radius: 5px;
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #319795;
  color: white;
  font-weight: 600;
  border-radius: 5px;
`;

const EmptyCartButton = styled(Button)`
  width: 100%;
  padding: 10px;
  background-color: #ccc;
  cursor: not-allowed;
`;

const Cart = () => {

    // const cart = useSelector(state=>state.cart);
   
    const [ stripeToken, setStripeToken ] = useState(null);
    const navigate = useNavigate();
    
    const onToken = (token) => {
        setStripeToken(token);
    }

    const dispatch = useDispatch();
    // const user = useSelector((state) => state.user.currentUser);
    const tokenUserId = Cookies.get('userId');
    const emailId = Cookies.get('email');


    const [ Carts, setCarts ] = useState([]);
    const [ Prices, setPrices ] = useState(null);

    const handleCopy = (message) => {
      navigator.clipboard.writeText(message); // Copy the message to the clipboard
      toast.success('Message copied to clipboard'); // Show a success toast indicating the message was copied
    };

    useEffect(() => {
      // Check if the user is on the cart page
      if (tokenUserId) {
        const message = 'Gunakan kartu kredit : 4242 4242 4242 4242 dan CVC : 123 untuk pembayaran';
  
        toast.info(
          <div>
            <span style={{ fontWeight: 'bold' }}>{message}</span><br></br>
            <button onClick={() => handleCopy(message)}>Copy</button>
          </div>
        ); // Show the toast notification with a copy button
      }
    }, [tokenUserId]);
    
    
    useEffect(() => {
        const makeRequest = async () => {
            try{
                const response = await userMethod.post("/checkout/payment", {
                    tokenUserId: stripeToken.id,
                    amount: Prices,
                })
                navigate("/success", { state: {stripeData: response.data, products: Carts.filter((item) => tokenUserId === item.userId)} });
            } catch (err) {
                console.log(err);
            } 
        }
        stripeToken &&  makeRequest();
    }, [stripeToken, Prices, navigate])

    useEffect(() => {
        const makeCartRequest = async () => {
            try{
                const response = await userMethod.get(`/cart/find/${tokenUserId}`);
                setCarts(response.data);
            } catch (err) {
                console.log(err);
            } 
        }
        makeCartRequest();
    }, [tokenUserId])

    const decreaseQuantity = async (cartId, productId) => {
      try {
        await userMethod.put(`/cart/decrease/${cartId}/${productId}`);
        const updatedCarts = Carts.map((cart) => {
          if (cart._id === cartId) {
            const updatedProducts = cart.products.map((product) => {
              if (product._id === productId) {
                const updatedQuantity = product.quantity - 1;
                const updatedPrice = product.price * updatedQuantity;
                if (updatedQuantity > 0) {
                  return {
                    ...product,
                    quantity: updatedQuantity,
                    total: updatedPrice,
                  };
                }
              }
              return null; // Return null for products with quantity less than 1
            }).filter((product) => product !== null); // Filter out null products
            if (updatedProducts.length === 0) {
              return false; // If no products left in the cart, filter out the cart as well
            }
            const updatedBill = updatedProducts.reduce((total, product) => total + product.total, 0);
            return {
              ...cart,
              products: updatedProducts,
              bill: updatedBill,
            };
          }
          return cart;
        }).filter((cart) => cart); // Filter out undefined carts
        setCarts(updatedCarts);
      } catch (err) {
        console.log(err);
      }
    };
    
    
      const increaseQuantity = async (cartId, productId) => {
        try {
          await userMethod.put(`/cart/increase/${cartId}/${productId}`);
          const updatedCarts = Carts.map((cart) => {
            if (cart._id === cartId) {
              const updatedProducts = cart.products.map((product) => {
                if (product._id === productId) {
                  return {
                    ...product,
                    quantity: product.quantity + 1,
                  };
                }
                return product;
              });
              return {
                ...cart,
                products: updatedProducts,
              };
            }
            return cart;
          });
          setCarts(updatedCarts);
        } catch (err) {
          console.log(err);
        }
      };
    
    useEffect(() => {
        const getPriceSummary = async () => {
            try{
                const response = await userMethod.get(`/cart/summary/${tokenUserId}`)
                setPrices(response.data);
            } catch (err) {
                console.log(err);
            } 
        }
        getPriceSummary();
    }, [tokenUserId, Carts, decreaseQuantity, increaseQuantity])


    const deleteCart = async (cartId, userId) => {
        try {
          // Asynchronous call to backend, wait to resolve
          await dispatch(removeCartItem(cartId)).unwrap;
          // Now dispatch action to remove item from state
          dispatch(removeItem(cartId));
          const updatedCarts = Carts.filter((cartItem) => cartItem._id !== cartId);
          const updatedProducts = updatedCarts.map((cartItem) => ({
            ...cartItem,
            products: cartItem.products.filter((product) => product._id !== userId),
          }));
        
          // Update the carts state with the updated products\
          setTimeout(() => {
            setCarts(updatedProducts);
            window.location.reload();
          }, 1000)

          notify();
        } catch(error) {
          // handle any errors
          console.log(error);
        }
    };
    
    const notify = () => {
        toast.success('Item has been deleted', {
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
            <Title>Your Cart</Title>
            <Flex justifyContent="center" margin="10px"> 
                <TopTexts>
                    <TopText>Shooping Cart({Carts.filter((item) => tokenUserId === item.userId).length})</TopText>
                    <Link to="/order/history">
                        <TopText>Order History</TopText>
                    </Link>
                </TopTexts>
            </Flex>
            <Bottom>
                <Info>
                {Carts.map((product) => (
                    <>
                    { tokenUserId === product.userId ? 
                    <Product>
                        <ProductDetail>
                            <Image src={product.products[0].img} alt="google"></Image>
                            <Details>
                                <ProductName><b>Product:</b> {product.products[0].title}</ProductName>
                                <Tooltip label={product.products[0].desc}>
                                    <Text cursor="pointer" noOfLines={[1]}><b>Description:</b>  {product.products[0].desc}</Text>
                                </Tooltip>
                                <Button onClick={() => {
                                    deleteCart(product._id, product.products[0]._id)
                                }}>Delete</Button>
                            </Details>
                        </ProductDetail>
                        <PriceDetail>
                        <ProductAmountContainer>
                            <AiOutlineMinus cursor="pointer" onClick={() => decreaseQuantity(product._id, product.products[0]._id)} />
                            <ProductAmount>{product.products[0].quantity}</ProductAmount>
                            <GrAdd cursor="pointer" onClick={() => increaseQuantity(product._id, product.products[0]._id)} />
                        </ProductAmountContainer>
                            <ProductPrice>$ {product.products[0].price * product.products[0].quantity}</ProductPrice>
                        </PriceDetail>
                    </Product>
                    :
                    null
                    }
                    </>
                    ))}
                    <Hr></Hr>
                </Info>
                <Summary>
                    <SummaryTitle>Order Summary</SummaryTitle>
                        <SummaryItem>
                            <SummaryItemText>Subtotal</SummaryItemText>
                            <SummaryItemPrice>$ {Carts.length}</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Estimated Shipping</SummaryItemText>
                            <SummaryItemPrice>$ 5</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText>Shipping Discount</SummaryItemText>
                            <SummaryItemPrice>$ -6</SummaryItemPrice>
                        </SummaryItem>
                        <SummaryItem>
                            <SummaryItemText type="total">Total</SummaryItemText>
                            <SummaryItemPrice>$ {Prices}</SummaryItemPrice>
                        </SummaryItem>
                        {Carts.filter((item) => tokenUserId === item.userId).length > 0 ? (
                        <StripeCheckout 
                        name="Kimia shop" 
                            email={emailId}
                            image="https://d3o2e4jr3mxnm3.cloudfront.net/Mens-Jake-Guitar-Vintage-Crusher-Tee_68382_1_lg.png"
                            billingAddress
                            shippingAddress
                            description={`your total is $ ${Prices}`}
                            amount={Prices * 100}
                            token={onToken}
                            stripeKey={KEY}
                            currency='USD'
                            >
                            <CheckoutButton>Checkout Now</CheckoutButton>
                        </StripeCheckout>
                         ) : (
                          <EmptyCartButton>Carts Empty</EmptyCartButton>
                         )}
                </Summary>
            </Bottom>
        </Wrapper>
        <Footer />
    </Container>
  )
}

export default Cart
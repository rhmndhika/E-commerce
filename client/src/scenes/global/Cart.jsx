import React, { useEffect } from 'react'
import styled from 'styled-components'
import Navbar from '../../components/Navbar.jsx'
import Footer from '../../components/Footer.tsx'
import { GrAdd} from 'react-icons/gr'
import { AiOutlineMinus} from 'react-icons/ai'
import { isMobile490, isTablet730 } from '../../reponsive'
import { useDispatch, useSelector } from 'react-redux'
import StripeCheckout from 'react-stripe-checkout'
import { useState } from 'react'
import { userMethod } from '../../useFetch.js'
import { Link, useNavigate } from 'react-router-dom'
import { removeCartItem } from '../../redux/apiCalls.js'
import { cartProductsSelector, cartQuantitySelector, cartTotalSelector, getCartTotal, removeItem } from '../../redux/cartRedux.js'
import axios from 'axios'   

const KEY =  "pk_test_51MuV3GECvrLW1LL9pTqGJ5eCINrDmbC81kIycSRw70xvBPx6KDHspuAxibLSQGprMc2TJzFKaRgowk8JwhMd7K6I00oOGcoFW4"

const Container = styled.div``

const Wrapper = styled.div`
    padding: 20px;
    ${isTablet730({ padding: "10px"})}
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
        props.type === "filled" ? "black" : "transparent"};
    color: ${(props) => props.type === "filled" && "white"};
`
const TopTexts = styled.div`
    ${isTablet730({ display: "none"})}
`

const TopText = styled.span`
    text-decoration: underline;
    cursor: pointer;
    margin: 0px 10px;
`

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    ${isTablet730({ flexDirection: "column"})}
`

const Info = styled.div`
    flex: 3;
`

const Product = styled.div`
    display: flex;
    justify-content: space-between;
    ${isMobile490({ flexDirection: "column"})}
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
    ${isMobile490({ padding: "5px 15px"})}
`
const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
    ${isMobile490({ marginBottom: "20px"})}
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
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
`;

const Cart = () => {

    axios.defaults.withCredentials = true;


    const cart = useSelector(state=>state.cart);
   
    const [ stripeToken, setStripeToken ] = useState(null);
    const navigate = useNavigate();
    
    const onToken = (token) => {
        setStripeToken(token);
    }

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser._id);


    const [ Carts, setCarts ] = useState([]);
    const [ Prices, setPrices ] = useState(null);

    const cartProducts = useSelector(cartProductsSelector);
    const cartQuantity = useSelector(cartQuantitySelector);
    const cartTotal = useSelector(cartTotalSelector);
    
    useEffect(() => {
        const makeRequest = async () => {
            try{
                const response = await userMethod.post("/checkout/payment", {
                    tokenId: stripeToken.id,
                    amount: 500,
                })
                navigate("/success", { state: {stripeData: response.data, products: Carts.filter((item) => user === item.userId)} });
            } catch (err) {
            } 
        }
        stripeToken &&  makeRequest();
    }, [stripeToken, cart.total, navigate])

    useEffect(() => {
        const makeCartRequest = async () => {
            try{
                const response = await userMethod.get(`/cart/find/${user}`)
                setCarts(response.data);
            } catch (err) {
                console.log(err);
            } 
        }
        makeCartRequest();
    }, [user])

    useEffect(() => {
        const getPriceSummary = async () => {
            try{
                const response = await userMethod.get(`/cart/summary/${user}`)
                setPrices(response.data);
            } catch (err) {
                console.log(err);
            } 
        }
        getPriceSummary();
    }, [user])


    const deleteCart = async (cartId, itemId) => {
        try {
          // Asynchronous call to backend, wait to resolve
          await dispatch(removeCartItem(cartId)).unwrap;
    
          // Now dispatch action to remove item from state
          dispatch(removeItem(itemId));
          window.location.reload();
        } catch(error) {
          // handle any errors
          console.log(error);
        }
    };

  return (
    <Container>
        <Navbar />
        <Wrapper>
            <Title>Your Bag</Title>
            <Top>
                <TopButton onClick={deleteCart}>Continue Shopping</TopButton>
                <TopTexts>
                    <TopText>Shooping Bag({Carts.filter((item) => user === item.userId).length})</TopText>
                    <Link to="/order/history">
                        <TopText>Order History</TopText>
                    </Link>
                </TopTexts>
                <TopButton type="filled">Checkout Now</TopButton>
            </Top>
            <Bottom>
                <Info>
                {Carts.filter((item) => user === item.userId).map((product) => (
                    <>
                    { user === product.userId ? 
                    <Product>
                        <ProductDetail>
                            <Image src={product.products[0].img} alt="google"></Image>
                            <Details>
                                <ProductName><b>Product:</b> {product.products[0].title}</ProductName>
                                <ProductId><b>ID:</b> {product.products[0]._id}</ProductId>
                                <Button onClick={() => {
                                    deleteCart(product._id, product.products[0]._id)
                                }}>Delete</Button>
                            </Details>
                        </ProductDetail>
                        <PriceDetail>
                            <ProductAmountContainer>
                                <AiOutlineMinus />
                                <ProductAmount>{product.products[0].quantity}</ProductAmount>
                                <GrAdd />
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
                        <StripeCheckout 
                            name="Kimia shop" 
                            image="https://d3o2e4jr3mxnm3.cloudfront.net/Mens-Jake-Guitar-Vintage-Crusher-Tee_68382_1_lg.png"
                            billingAddress
                            shippingAddress
                            description={`your total is $ ${Prices}`}
                            amount={Prices * 100}
                            token={onToken}
                            stripeKey={KEY}
                            >
                            <Button>Checkout Now</Button>
                        </StripeCheckout>
                </Summary>
            </Bottom>
        </Wrapper>
        <Footer />
    </Container>
  )
}

export default Cart
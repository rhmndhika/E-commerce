import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userMethod } from '../../useFetch'
import { removeItem } from '../../redux/cartRedux' 
import { removeCartItem } from '../../redux/apiCalls'
import Cookies from 'js-cookie';

const Succes = () => {
  
  const location = useLocation();

  const data = location.state.stripeData;
  const cart = location.state.products;

  // const currentUser = useSelector((state) => state.user.currentUser);
  const tokenUserId = Cookies.get('userId');
  const [ orderId, setOrderId ] = useState(null);
  const [ Prices, setPrices ] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const getPriceSummary = async () => {
        try{
            const response = await userMethod.get(`/cart/summary/${tokenUserId}`)
            setPrices(response.data);
            console.log(Prices)
        } catch (err) {
            console.log(err);
        } 
    }
    getPriceSummary();
  }, []);

  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await userMethod.post("/order/create", {
          userId: tokenUserId,
          products: cart.map((item) => ({
            productId: item.products[0]._id,
            quantity: item.products[0].quantity,
          })),
          amount: Prices,
          address: data.billing_details.address
        });
        setOrderId(res.data._id);
      } catch (err) {
        console.log(err);
      }
    };
    data && createOrder();
  }, [cart, data, tokenUserId, Prices]);


  const resetCart = () => {
    dispatch(removeItem());
  }

 
  return (
    <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {orderId
      ? `Order has been created successfully. Your order number is ${orderId}`
      : `Successfull. Your order is being prepared...`}
    <Link to="/">
      <button style={{ padding: 10, marginTop: 20 }} onClick={resetCart}>Go to Homepage</button>
    </Link>
  </div>
  )
}

export default Succes
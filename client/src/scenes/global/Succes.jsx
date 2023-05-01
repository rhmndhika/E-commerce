import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userMethod } from '../../useFetch'
import { removeItem } from '../../redux/cartRedux' 
import axios from 'axios'
import { removeCartItem } from '../../redux/apiCalls'

const Succes = () => {
  
  const location = useLocation();

  const data = location.state.stripeData;
  const cart = location.state.products;

  const currentUser = useSelector((state) => state.user.currentUser);
  const [ orderId, setOrderId ] = useState(null);
  const [ Prices, setPrices ] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const getPriceSummary = async () => {
        try{
            const response = await userMethod.get(`/cart/summary/${currentUser._id}`)
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
          userId: currentUser._id,
          products: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          amount: Prices,
          address: data.billing_details.address,
        });
        setOrderId(res.data._id);
      } catch (err) {
        console.log(err);
      }
    };
    data && createOrder();
  }, [cart, data, currentUser, Prices]);

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
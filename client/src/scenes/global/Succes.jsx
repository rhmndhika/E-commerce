// import React, { useState, useEffect } from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import { useDispatch, useSelector } from 'react-redux'
// import { userMethod } from '../../useFetch'
// import { removeItem } from '../../redux/cartRedux' 

// const Succes = () => {
  
//   const location = useLocation();

//   const data = location.state.stripeData;
//   const cart = location.state.products;

//   const currentUser = useSelector((state) => state.user.currentUser);
//   const [orderId, setOrderId] = useState(null);

//   const dispatch = useDispatch();

//   console.log(cart)

//   useEffect(() => {
//     const createOrder = async () => {
//       try {
//         const res = await userMethod.post("/order/create", {
//           userId: currentUser._id,
//           products: cart.products.map((item) => ({
//             productId: item._id,
//             quantity: item._quantity,
//           })),
//           amount: cart.total,
//           address: data.billing_details.address,
//         });
//         setOrderId(res.data._id);
//       } catch {}
//     };
//     data && createOrder();
//   }, [cart, data, currentUser]);

//   const resetCart = () => {
//     dispatch(removeItem());
//   }


//   return (
//     <div
//     style={{
//       height: "100vh",
//       display: "flex",
//       flexDirection: "column",
//       alignItems: "center",
//       justifyContent: "center",
//     }}
//   >
//     {orderId
//       ? `Order has been created successfully. Your order number is ${orderId}`
//       : `Successfull. Your order is being prepared...`}
//     <Link to="/">
//       <button style={{ padding: 10, marginTop: 20 }} onClick={resetCart}>Go to Homepage</button>
//     </Link>
//   </div>
//   )
// }

// export default Succes
import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userMethod } from '../../useFetch'
import { removeItem } from '../../redux/cartRedux' 

const Succes = () => {
  
  const location = useLocation();

  const data = location.state.stripeData;
  const cart = location.state.products;

  const currentUser = useSelector((state) => state.user.currentUser);
  const [orderId, setOrderId] = useState(null);

  const dispatch = useDispatch();



  useEffect(() => {
    const createOrder = async () => {
      try {
        const res = await userMethod.post("/order/create", {
          userId: currentUser._id,
          products: cart.products.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          amount: "0",
          address: data.billing_details.address,
        });
        setOrderId(res.data._id);
      } catch (err) {
        console.log(err);
      }
    };
    data && createOrder();
  }, [cart, data, currentUser]);

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
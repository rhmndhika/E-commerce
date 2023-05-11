import React, { useState, useEffect } from 'react'
import { Button } from '@chakra-ui/react'
import StripeCheckout from 'react-stripe-checkout'
import axios from 'axios'
import { useNavigate } from 'react-router'

const Payment = () => {

    const KEY = "pk_test_51MuV3GECvrLW1LL9pTqGJ5eCINrDmbC81kIycSRw70xvBPx6KDHspuAxibLSQGprMc2TJzFKaRgowk8JwhMd7K6I00oOGcoFW4";

    const [ stripeToken, setStripeToken ] = useState(null);
    let navigate = useNavigate();

    const onToken = (token) => {
       setStripeToken(token);
    }

    useEffect(() => {
        const makeRequest = async () => {
            try {
                const response = await axios.post("http://localhost:5000/checkout/payment", {
                    tokenId: stripeToken.id,
                    amount: 2000, 
                });
                console.log(response.data);
                navigate("/succes");
            } catch(err) {
                console.log(err);
            }
        }
        makeRequest();
    }, [stripeToken], navigate);

  return (
    <StripeCheckout 
        name="Kimia shop" 
        image="https://d3o2e4jr3mxnm3.cloudfront.net/Mens-Jake-Guitar-Vintage-Crusher-Tee_68382_1_lg.png"
        billingAddress
        shippingAddress
        description="your total is IDR 20.000"
        amount={2000}
        token={onToken}
        stripeKey={KEY}
        >
        <Button>Payment</Button>
    </StripeCheckout>
  )
}

export default Payment
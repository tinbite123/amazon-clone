import React, { useContext, useState } from 'react'
import LayOut from '../../Components/LayOut/LayOut'
import classes from './Payment.module.css'
import { DataContext } from '../../Components/DataProvider/DataProvider'
import ProductCard from '../../Components/Product/ProductCard'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CurrencyFormate from '../../Components/CurrencyFormate/CurrencyFormate'
import { axiosInstance } from '../../Api/axios'
import { ClipLoader } from 'react-spinners'
import { db } from '../../Utility/firebase'
import { useNavigate } from 'react-router-dom'
import { Type } from '../../Utility/action.type'

function Payments() {
  const [{ user, basket }, dispatch] = useContext(DataContext)
  // console.log(user);

  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount
  }, 0)

  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount
  }, 0);

  const [cardError, setcardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleChange = (e) => {
    // console.log(e);
    e?.error?.message ? setcardError(e?.error?.message) : setcardError("")
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);
      // 1. backend || functions ---> contact to the client secret

      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`,
      });

      console.log(response.data);
      const clientSecret = response?.data?.clientSecret;
      // 2. client side (react side conformation)
      // console.log(
      //   "clientSecret",clientSecret
      // );

      const { paymentIntent } = await stripe.confirmCardPayment
        (clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });
      // console.log(paymentIntent);
      // 3. after the conformation --> order firestore database save, clear basket

      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });
        
        // empty the basket
        dispatch({
          type: Type.EMPTY_BASKET
        })
      setProcessing(false)
      navigate("/orders", { message: "you have placed new Order" });
    } catch (error) {
      console.log(error);
      setProcessing(false)
    }

  }

  //   const handlePayment = async (e) => {
  //     e.preventDefault();
  //     try {
  //       setProcessing(true);
  //       const response = await axiosInstance({
  //         method: "POST",
  //         url: `/payment/create?total=${total * 100}`,
  //       });
  //       console.log(response.data);
  //       const clientSecret = response?.data?.clientSecret;

  //       const {paymentIntent} = await stripe.confirmCardPayment(clientSecret, {
  //         payment_method: {
  //           card: elements.getElement(CardElement),
  //         },
  //       });

  //       await db.collection("users").doc(user.uid).collection("orders").doc(paymentIntent.id).set({
  //         basket:basket,
  //         amount:paymentIntent.amount,
  //         created:paymentIntent.created
  //       })
  // // dispatch({
  // //   type:Type.EMPTY_BASKET
  // // })
  //       setProcessing(false);
  //       navigate('/orders',{state:{msg:"you have placed new order"}})
  //     } catch (error) {
  //       console.log('not working');
  //       console.log(error);
  //       setProcessing(false);
  //     }
  //   };

  return (
    <LayOut>
      {/* header */}
      <div className={classes.payment__header}>Checkout({totalItem}) items</div>
      {/* payment methods */}
      <section className={classes.payment}>
        {/* address */}
        <div className={classes.flex}>
          <h3>Delivery address</h3>
          <div>{user?.email}</div>
          <div>React Street 123</div>
          <div>Norway, Bergen</div>
        </div>
        <hr />

        {/* product */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item, i) => {
              return <ProductCard product={item} flex={true} key={i} />
            })}
          </div>
        </div>
        <hr />

        {/* card form */}
        <div className={classes.flex}>
          <h3>Payment methods</h3>
          <div className={classes.payment__card__container}>
            <div className={classes.payment__details}>
              <form onSubmit={handlePayment}>
                {/* error */}
                {
                  cardError && (<small style={{ color: "red" }}>{cardError}</small>
                  )}

                {/* card element */}
                <CardElement onChange={handleChange} />

                {/* price */}
                <div className={classes.payment__price}>
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total Order |</p> <CurrencyFormate amount={total} />
                    </span>
                  </div>
                  <button type='submit'>
                    {
                      processing ? (
                        <div className={classes.loading}>
                          <ClipLoader color="gray" size={12} />
                          <p>Please wait ...</p>
                        </div>

                      ) : "Pay Now"
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

    </LayOut>
  )
}

export default Payments
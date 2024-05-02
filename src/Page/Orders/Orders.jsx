import React, { useState, useContext, useEffect } from 'react'
import LayOut from '../../Components/LayOut/LayOut'
import classes from './Orders.module.css'
import { db } from '../../Utility/firebase'
import { DataContext } from '../../Components/DataProvider/DataProvider'
import ProductCard from '../../Components/Product/ProductCard'

function Orders() {
  const [{user}, dispatch] = useContext(DataContext)
  const [orders, setOrders] = useState([])

  useEffect(() => {

  //         setOrders(
  //             snapshot.docs.map((doc)=>({
  //                 id:doc.id,
  //                 data:doc.data()
  //             }))
  //         )
  //     })
  // }
    if (user) {
      db.collection("users")
        .doc(user.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot((snapshot) => {
          console.log(snapshot);
            setOrders(
              snapshot.docs.map((doc)=>({
                id:doc.id,
                data:doc.data()
              })),
            );
          });
        }else {
      setOrders([])
    }
  })

  return (
      <LayOut>
        <section className={classes.container}>
          <div className={classes.order__container}>
            <h2>Your Orders</h2>
            {
              orders?.length === 0 && (
              <div style={{ padding: "20px" }}>
                You don't have any orders yet.
              </div>)
              
            }
            {/* ordered items */}
            <div>
              {orders?.map((eachOrder, i) => {
                  return (
                    <div key={i}>
                      <hr />
                      <p>Order Id: {eachOrder.id}</p>
                      {eachOrder?.data?.basket?.map((order) => {
                          return(
                            <ProductCard flex={true} product={order} key={order.id} />
                          )
                        })}
                    </div>
                  )
                })}
            </div>
          </div>
        </section>
        
      </LayOut>
  )
}

export default Orders
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'
import classes from './Product.module.css'
import Loader from '../Loader/Loader'

function Product() {
    const [products, setProduct] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        axios.get('https://fakestoreapi.com/products')
        .then((res)=>{
            setProduct(res.data)
            setIsLoading(false)
        }).catch((err)=>{
      setIsLoading(false)
      console.log(err) 
        })},[])

        return (

            <>
            {
                isLoading?(<Loader />) : (                
                    <section className={classes.products__container}>
                    {
                        products.map((singleProduct)=>{
                            return <ProductCard renderAdd={true} product={singleProduct} key={singleProduct.id}/>
                        }) 
                    }
                    </section>)
            }
    </>
        
    )

}

export default Product
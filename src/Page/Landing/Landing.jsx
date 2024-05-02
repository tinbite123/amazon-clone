import React from 'react'
import LayOut from '../../Components/LayOut/LayOut'
import Carousel from '../../Components/Carousel/CarouselEffect'
import Category from '../../Components/Catagories/Category'
import Product from '../../Components/Product/product'

function Landing() {
  return (
    <LayOut>
        <Carousel/>
        <Category />
        <Product />
    </LayOut>
  )
}

export default Landing
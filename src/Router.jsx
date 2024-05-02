import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Page/Landing/Landing'
import Auth from './Page/Auth/Auth'
import Payments from './Page/Payment/Payment'
import Orders from './Page/Orders/Orders'
import Result from './Page/Results/Result'
import Cart from './Page/Cart/Cart'
import ProductDetail from './Page/ProductDetail/ProductDetail'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

const stripePromise = loadStripe(
  'pk_test_51P7dAmE1dJgnqyUZv4bQ6VHz5CHFSEFiybugOt2aA5I2XL4mqEYJBcH4VDMWGlSH1NoSxt9e0W9drlUzUs9Kanj400G0B2lETE'
);
function Routeing() {
  return (
    <Router>
        <Routes> 
            <Route path="/" element={<Landing/>} />
            <Route path="/auth" element={<Auth/>} />
            <Route path="/payments" element={
                <ProtectedRoute 
                  message={"You must login to pay"}
                  redirect={"/payments"}
                >
                <Elements stripe={stripePromise}>
                  <Payments/>
                </Elements>
                </ProtectedRoute>
              } 
            />
            <Route path="/orders" element={
              <ProtectedRoute 
                message={"You must login to access your orders"}
                redirect={"/orders"}
            >
              <Orders/>
            </ProtectedRoute>
            
            }/>
            <Route path="/category/:categoryName" element={<Result /> } />
            <Route path="/product/:productId" element={<ProductDetail /> } />
            <Route path="/cart" element={<Cart/>} />
        </Routes>
    </Router>
  )
}

export default Routeing
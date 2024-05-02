import React from 'react'
import { AiOutlineMenu } from 'react-icons/ai';
import classes from './header.module.css';

function LowerHeader() {
  return (
    <div className={classes.lower__container}>

        <ul>
            <li>
            <AiOutlineMenu /> 
            All
            </li>
            <li>Today's Deals</li>
            <li>Costumer Service</li>
            <li>Registry</li>
            <li>Gift Cards</li>
            <li>Sell</li>
        </ul>

    </div>

)
}

export default LowerHeader
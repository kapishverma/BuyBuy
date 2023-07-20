import React from 'react'
import css from "./Css/CartItem.module.css"
import plus from "../../image/plus.png"
import minus from "../../image/minus.png"
import { useContextValue } from '../../Contexts/BuyBuyContext';

export default function CartItem(props) {
    const { itemRef, name, image, price, qty } = props.item;
    const { increaseQuantity, decreaseQuantity, removeFromCart } = useContextValue();


    function handleRemove(e) {
        e.preventDefault();
        removeFromCart(itemRef);
    }
    return (
        <div className={css.Item}>
            <div className={css.imageContainer}>
                <img src={image} alt="" />
            </div>
            <div className={css.itemDetail}>
                <p>{name}</p>
                <div>
                    <h1>&#x20B9; {price}</h1>
                    <div>
                        <img src={minus} alt="" onClick={() => increaseQuantity(itemRef, qty)} />
                        <span>{qty}</span>
                        <img src={plus} alt="" onClick={() => decreaseQuantity(itemRef, qty)} />
                    </div>
                </div>
            </div>
            <div className={css.btn}>
                <button onClick={(e) => handleRemove(e)}>Remove item</button>
            </div>
        </div>
    )
}

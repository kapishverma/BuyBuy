import React from 'react'
import css from "./Css/Item.module.css"
import { useContextValue } from '../../Contexts/BuyBuyContext';

export default function Item(props) {
    const { id, name, price, image, category } = props.item;

    const { addItem } = useContextValue();
    const handleAddToCart = (e) => {
        addItem(props.item)
    }

    return (
        <div className={css.Item}>
            <div className={css.imageContainer}>
                <img src={image} alt="" />
            </div>
            <div className={css.itemDetail}>
                <p>{name}</p>
                <h2>&#x20B9; {price}</h2>
            </div>
            <div className={css.btn}>
                <button onClick={(e) => handleAddToCart(e)}>ADD to Cart</button>
            </div>
        </div>
    )
}

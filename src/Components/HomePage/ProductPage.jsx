import React from 'react'
import Item from './Item'
import css from "./Css/ProductPage.module.css"
import { useContextValue } from '../../Contexts/BuyBuyContext'

export default function ProductPage() {
    const { products, handleKeyWordFilter } = useContextValue();


    return (
        <div className={css.productPage}>
            <div className={css.inputField}>
                <input onChange={(e) => handleKeyWordFilter(e)} type="text" placeholder='Filter by keyWord' />
            </div>
            {products && products.map((item) => <Item key={item.id} item={item} />
            )}
        </div>
    )
}

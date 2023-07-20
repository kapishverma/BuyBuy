import React, { useEffect, useState } from 'react'
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from '../../Firebase/Firebase';
import css from "./Css/CartPage.module.css"
import { useContextValue } from '../../Contexts/BuyBuyContext'
import CartItem from './CartItem';

export default function CartPage() {

  const { userUID, purchase, notify, cartItems, setCartItems, totalPrice, setTotalPrice,setIsLoading } = useContextValue();
  const UID = userUID || localStorage.getItem("userUID");


  useEffect(() => {
    (async () => {
      await onSnapshot(collection(db, "User", UID, "MyCart"), (querySnapshot) => {
        const newCartItems = [];
        let price = 0;
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            price = price + (doc.data().price * doc.data().qty);
            newCartItems.push({ itemRef: doc.id, ...doc.data() });//~ itemRef is id of item document in myCart collecion since it have one id itself in doc.data()
          });
          setTotalPrice(price);
          setCartItems(newCartItems);
        }
      });
    })();
  }, [])


  function handlePurchase(e) {
    e.preventDefault();
    purchase();
  }

  return (
    <>

      <div className={css.container}>
        <div className={css.purchaseBox}>
          <div className={css.purchase}>
            <h1>Total Price:</h1>
            <h2>&#x20B9; {totalPrice}</h2>
            <button onClick={(e) => handlePurchase(e)}>Purchase</button>
          </div>
        </div>
      </div>

      <div className={css.CartPage}>
        {cartItems.map((item) => {
          return <CartItem key={item.itemRef} item={item} />
        })}
      </div>
    </>

  )
}

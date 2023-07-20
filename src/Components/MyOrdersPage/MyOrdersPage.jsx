import React, { useEffect, useState } from 'react'
import css from "./Css/MyOrdersPage.module.css"
import Table from './Table'
import { useContextValue } from '../../Contexts/BuyBuyContext'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../Firebase/Firebase'


export default function MyOrdersPage() {
  const { userUID, notify } = useContextValue();
  const [myOrders, setMyorders] = useState();

  useEffect(() => {
    (async () => {
      const querySnapshot = await getDocs(collection(db, "User", localStorage.getItem("userUID"), "MyOrders"));
      if (querySnapshot.empty) {
        notify("info", "You haven't Bought anything yet.")
        return;
      }
      const singleOrderArray = [];

      querySnapshot.forEach((doc) => {
        const { purchaseDate, itemsList } = doc.data();
        singleOrderArray.push({ id: doc.id, purchaseDate, itemsList });
      })
      setMyorders(singleOrderArray);
    })()
  }, []);

  return (
    <div className={css.MyOrdersPage}>
      {myOrders && myOrders.map((myOrder) => <Table key={myOrder.id} myOrder={myOrder} />)}
    </div>
  )
}

import React from 'react'
import css from "./Css/Table.module.css"

export default function Table(props) {
    const { myOrder } = props;
    let totalPrice = 0;
    return (
        <div className={css.tableContainer}>
            <h1>Ordered On:- {myOrder.purchaseDate}</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>{myOrder.itemsList.map((item,index) => {
                    totalPrice = totalPrice + (item.qty * item.price);
                    return (<tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>{item.qty}</td>
                        <td>{item.qty * item.price}</td>
                    </tr>)
                })
                }
                    <tr>
                        <td colSpan={3}>Grand Total</td>
                        <td>{totalPrice}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

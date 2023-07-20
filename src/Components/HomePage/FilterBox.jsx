import { useRef, useState } from "react";
import css from "./Css/FilterBox.module.css";
import { useContextValue } from "../../Contexts/BuyBuyContext";
import { Outlet } from "react-router-dom";

export default function FilterBox() {
    const rangeRef = useRef();
    const formRef = useRef(); // Create a separate form reference

    const { filterProducts } = useContextValue();

    const [price, setPrice] = useState(90000);


    function handleFilter(e) {
        setPrice(rangeRef.current.value);
        filterProducts(e);
    }


    return (
        <>
            <div className={css.container}>
                <div className={css.formContainer}>
                    <h1>Filter</h1>
                    <h1>&#x20B9; {price}</h1>
                    <form ref={formRef} onChange={(e) => handleFilter(e)} action="">
                        <input type="range" ref={rangeRef} name="seekbar" min="0" max="100000" defaultValue="90000" /> <br />
                        <div className={css.checkBox_container}>
                            <input type="checkbox" id="Men's Clothing" name="Men's Clothing" value="Men's Clothing" />
                            <label htmlFor="Men's Clothing">Men's Clothing</label> <br />
                        </div>
                        <div className={css.checkBox_container}>
                            <input type="checkbox" id="Women's Clothing" name="Women's Clothing" value="Women's Clothing" />
                            <label htmlFor="Women's Clothing">Women's Clothing</label> <br />
                        </div>
                        <div className={css.checkBox_container}>
                            <input type="checkbox" id="Jewelery" name="Jewelery" value="Jewelery" />
                            <label htmlFor="Jewelery">Jewelery</label> <br />
                        </div>
                        <div className={css.checkBox_container}>
                            <input type="checkbox" id="Electronics" name="Electronics" value="Electronics" />
                            <label htmlFor="Electronics">Electronics</label> <br />
                        </div>
                    </form>
                </div>
            </div>
            <Outlet />
        </>
    )
}
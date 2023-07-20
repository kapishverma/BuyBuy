import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import css from "./ErrorPage.module.css";
import { useContextValue } from '../../Contexts/BuyBuyContext';

export default function ErrorPage() {
    const navigate = useNavigate();
    const { notify } = useContextValue();

    useEffect(() => {
        notify("info", "Page will Redirect To Previous Page after 10 sec ")
        setTimeout(() => {
            navigate(-1);
        }, 10000);
    }, []);

    return (
        <section className={css.page_404}>
            <div className={css.four_zero}>
                <h1 className={css['text-center']}>404</h1>
            </div>
            <div>
                <h3>
                    Look like you're lost
                </h3>
                <p>The page you are looking for is not available!</p>

                <NavLink to="/" className={css.link_404}>Go to Home</NavLink>
            </div>
        </section>
    );
}

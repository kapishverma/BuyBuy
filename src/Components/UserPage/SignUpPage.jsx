import React, { useEffect, useRef } from 'react'
import css from "./css/SignInPage.module.css"
import { NavLink, useNavigate } from 'react-router-dom'
import { useContextValue } from '../../Contexts/BuyBuyContext';

export default function LoginPage() {

    const { signUp } = useContextValue();
    const navigate = useNavigate();

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    useEffect(() => {
        emailRef.current.value = localStorage.getItem("email") || "";
        passwordRef.current.value = localStorage.getItem("password") || "";
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        const isSignedUp = signUp(name, email, password);
        if (isSignedUp) {
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
            navigate("/signin");
        }
    }
    return (
        <div className={css.LoginPageContainer}>
            <div className={css.formBorderContainer}>
                <div className={css.formContainer}>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <h2>Name</h2>
                        <input ref={nameRef} type="text" placeholder='Please Enter Your Name here' maxLength={15} required/>
                        <h2>UserName</h2>
                        <input ref={emailRef} type="email" placeholder='Please Enter Email here' required/>
                        <h2>Password</h2>
                        <input ref={passwordRef} type="password" placeholder='Please Enter Password here' minLength={6} required/>
                        <br />
                        <button>Sign-Up</button>
                    </form>
                    <NavLink to={"/signin"}>Already have account? Sign-In here</NavLink>
                </div>
            </div>
        </div>
    )
}

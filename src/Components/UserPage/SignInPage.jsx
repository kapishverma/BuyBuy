import React, { useRef, useEffect } from 'react'
import css from "./css/SignInPage.module.css"
import { NavLink, useNavigate } from 'react-router-dom'
import { useContextValue } from '../../Contexts/BuyBuyContext'

export default function LoginPage() {

    const { signIn } = useContextValue();
    const navigate = useNavigate();

    const emailRef = useRef("");
    const passwordRef = useRef();

    useEffect(() => {
        emailRef.current.value = localStorage.getItem("email") || "";
        passwordRef.current.value = localStorage.getItem("password") || "";
    }, []);


    const onSubmit = async (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        // console.log("email:", email, " , password: ", password);
        let isSignedIn = await signIn(email, password);
        if (isSignedIn) {
            localStorage.setItem("email", email);
            localStorage.setItem("password", password);
            navigate("/");
        }
    }

    return (
        <div className={css.LoginPageContainer}>
            <div className={css.formBorderContainer}>
                <div className={css.formContainer}>
                    <form action="" onSubmit={(e) => onSubmit(e)}>
                        <h2>Email</h2>
                        <input ref={emailRef} type="email" placeholder='Please Enter Email here' />
                        <h2>Password</h2>
                        <input ref={passwordRef} type="password" placeholder='Please Enter Password here' />
                        <br />
                        <button>Sign-In</button>
                    </form>
                    <NavLink to={"/signup"}>New User? SignUp here</NavLink>
                </div>
            </div>
        </div>
    )
}

import css from "./Css/NavBar.module.css"
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useContextValue } from "../../Contexts/BuyBuyContext"


export default function NavBar() {
    const { userUID, notify, logOut } = useContextValue();
    const navigate = useNavigate();

    const onClick = async (e) => {
        e.preventDefault();
        await logOut();
        notify("success", "Log-out Successful");
        navigate("/");
    }
    return (
        <>
            <div className={css.navBar}>
                <div className={css.icon}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3744/3744228.png" alt="" />
                    <span>BuyBuy</span>
                </div>
                <div className={css.buttons}>
                    <NavLink style={({ isActive }) => isActive ? { color: "red" } : undefined} to={"/"}>
                        <div className={css.btn}>
                            <img src="https://cdn-icons-png.flaticon.com/512/10473/10473299.png" alt="" />
                            <h2>Home</h2>
                        </div>
                    </NavLink>
                    {userUID &&
                        <>
                            <NavLink style={({ isActive }) => isActive ? { color: "red" } : undefined} to={"/myOrders"}>
                                <div className={css.btn}>
                                    <img src="https://cdn-icons-png.flaticon.com/512/1376/1376362.png" alt="" />
                                    <h2>MyOrder</h2>
                                </div>
                            </NavLink>
                            <NavLink style={({ isActive }) => isActive ? { color: "red" } : undefined} to={"/cart"}>
                                <div className={css.btn}>
                                    <img src="https://cdn-icons-png.flaticon.com/512/6145/6145556.png" alt="" />
                                    <h2>Cart</h2>
                                </div>
                            </NavLink>
                            <NavLink onClick={(e) => onClick(e)}>
                                <div className={css.btn}>
                                    <img src="https://cdn-icons-png.flaticon.com/512/1348/1348448.png" alt="" />
                                    <h2>LogOut</h2>
                                </div>
                            </NavLink>
                        </>}
                    {!userUID &&
                        <NavLink style={({ isActive }) => isActive ? { color: "red" } : undefined} to={"/signin"}>
                            <div className={css.btn}>
                                <img src="https://cdn-icons-png.flaticon.com/512/1348/1348464.png" alt="" />
                                <h2>Log-In</h2>
                            </div>
                        </NavLink>
                    }
                </div>
            </div>
            <Outlet />
        </>
    )
}


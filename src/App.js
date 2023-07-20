import NavBar from "./Components/HomePage/Navbar";
import FilterBox from "./Components/HomePage/FilterBox";
import ProductPage from "./Components/HomePage/ProductPage";
import SignInPage from "./Components/UserPage/SignInPage";
import SignUpPage from "./Components/UserPage/SignUpPage"
import MyOrdersPage from "./Components/MyOrdersPage/MyOrdersPage";
import CartPage from "./Components/CartPage/CartPage";
import BuyBuyContext from "./Contexts/BuyBuyContext";
import { RouterProvider, createBrowserRouter, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorPage from "./Components/Error/ErrorPage";

function App() {
  // const navigate = useNavigate();

  const notify = (type, massage) => {
    switch (type) {
      case "info":
        toast.info(massage, {
          theme: "dark"
        });
        break;
      case "success":
        toast.success(massage, {
          theme: "dark"
        });
        break;
      case "warn":
        toast.warn(massage, {
          theme: "dark"
        });
        break;
      case "error":
        toast.error(massage, {
          theme: "dark"
        });
        break;
      default:
        toast(massage, {
          theme: "dark"
        });
        break;
    }
  }


  const BrowserRouter = createBrowserRouter([
    {
      path: "/",
      element: <NavBar />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "", element: <FilterBox />, children: [
            { index: true, element: <ProductPage /> }
          ]
        },
        { path: "signin", element: <SignInPage /> },
        { path: "signup", element: <SignUpPage /> },
        { path: "myOrders", element: <MyOrdersPage /> },
        { path: "cart", element: <CartPage /> },
      ]
    }
  ])


  return (<>
    <BuyBuyContext notify={notify}>
      <RouterProvider router={BrowserRouter} />
      <ToastContainer />
    </BuyBuyContext>
  </>)
}

export default App;
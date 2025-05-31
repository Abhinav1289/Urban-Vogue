import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import "locomotive-scroll/dist/locomotive-scroll.css";
import HomePage from "./components/HomePage/Homepage";
import { Layout } from "./layout/Layout";
import ProductPage from "./components/products/Products";
import SinglePage from "./components/singlePage/SinglePage";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // Import Protected Route
import Cart from "./components/Cart/Cart";
import Wishlist from "./components/Wishlist/Wishlist"; // Example protected page
import Checkout from "./components/Orders/Checkout";
import UserOrders from "./components/Orders/UserOrders";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/products", element: <ProductPage /> },
      { path: "/product/:id", element: <SinglePage /> },
      { path: "/cart", element: <Cart /> },
      { path: "/wishlist", element: <Wishlist /> },
      { path: "/orders/checkout", element: <Checkout /> },
      { path: "/orders", element: <UserOrders /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  // {
  //   path: "/",
  //   element: <ProtectedRoute />, // Protected Route
  //   children: [{ path: "/wishlist", element: <Wishlist /> }],
  // },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

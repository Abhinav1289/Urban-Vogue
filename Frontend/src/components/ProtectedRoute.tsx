import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  const auth = useContext(AuthContext);
  if (auth?.isLoading) return <p>Loading...</p>;
  return auth?.user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
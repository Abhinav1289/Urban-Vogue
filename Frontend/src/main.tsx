import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <WishlistProvider>
    <App />
    </WishlistProvider>
  </AuthProvider>
);

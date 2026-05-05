import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./Context/shopContext";

import AuthProvider from "./Context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </AuthProvider>
  </BrowserRouter>
);

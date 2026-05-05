import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import UserLayout from "./layouts/UserLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProtectedRoute from "./pages/ProtectedRoute";
import AddAddress from "./pages/AddAddress";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";




import { AdminAuthProvider } from "./admin/context/AdminAuthContext";
import AdminLogin from "./admin/pages/Login";
import AdminProtectedRoute from "./admin/routes/AdminProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";


import ProductsList from "./admin/pages/Products/ProductsList";
import AddProduct from "./admin/pages/Products/AddProduct";
import EditProduct from "./admin/pages/Products/EditProduct";
import Orders from "./admin/pages/Orders";
import Users from "./admin/pages/Users";

function App() {
  return (
    <AdminAuthProvider>
       <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* USER APP  */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add-address"
            element={
              <ProtectedRoute>
                <AddAddress />
              </ProtectedRoute>
            }
          />

          
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
        </Route>

        {/*  ADMIN AUTH  */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN  */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;

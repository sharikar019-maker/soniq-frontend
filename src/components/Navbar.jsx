import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { ShopContext } from "../Context/shopContext";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const { quantity } = useContext(ShopContext);

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded transition ${
      isActive ? "bg-blue-700" : "hover:bg-blue-700"
    }`;

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
         <h1 className="font-extrabold text-lg">SONIQ</h1>
          
          <div className="flex items-center space-x-2">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/shop" className={linkClass}>
              Shop
            </NavLink>

            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>

            {user && (
              <NavLink to="/profile" className={linkClass}>
                Profile
              </NavLink>
            )}
          </div>

          
          <div className="flex items-center space-x-4">

           
            <NavLink to="/cart" className="relative flex items-center">
              <FaShoppingCart size={22} />

              {quantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {quantity}
                </span>
              )}
            </NavLink>

            
            {!user && (
              <NavLink
                to="/login"
                className="px-8 py-2 rounded bg-blue-700 hover:bg-blue-800 transition"
              >
                Login
              </NavLink>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

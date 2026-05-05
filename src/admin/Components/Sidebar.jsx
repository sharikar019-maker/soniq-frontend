import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const Sidebar = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded-lg transition ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4">
      <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>

      <nav className="space-y-2">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/admin/orders" className={linkClass}>
          Orders
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          Users
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;

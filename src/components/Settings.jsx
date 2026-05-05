import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Settings = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const AdminAuthContext = createContext(null);

const api = axios.create({ baseURL: "http://localhost:5000/api" });

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── On app start: verify token and check role ──────────────────
  useEffect(() => {
    const verifyAdmin = async () => {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.data;

        // only allow admin role
        if (user.role === "admin") {
          setAdmin(user);
        } else {
          Cookies.remove("token");
          setAdmin(null);
        }
      } catch {
        Cookies.remove("token");
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  // ─── Admin Login ────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, data } = res.data;

      if (data.role !== "admin") {
        return { success: false, error: "Access denied. Admins only." };
      }

      Cookies.set("token", token, { expires: 7 });
      setAdmin(data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      return { success: false, error: message };
    }
  };

  // ─── Admin Logout ───────────────────────────────────────────────
  const logout = () => {
    Cookies.remove("token");
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
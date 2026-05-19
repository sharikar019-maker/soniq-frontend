import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const AdminAuthContext = createContext(null);

// Separate bare axios instance for auth calls (no interceptors needed here)
const authApi = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // ✅ sends httpOnly refresh cookie automatically
});

// ✅ Single source of truth for cookie key — must match adminApi.js
const TOKEN_KEY = "adminToken";

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── On app start: verify stored token and check role ──────────────────────
  useEffect(() => {
    const verifyAdmin = async () => {
      const token = Cookies.get(TOKEN_KEY);
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await authApi.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data.data;

        if (user.role === "admin") {
          setAdmin(user);
        } else {
          // Logged in but not admin — clear and reject
          Cookies.remove(TOKEN_KEY);
          setAdmin(null);
        }
      } catch {
        // Token expired or invalid — clear it
        Cookies.remove(TOKEN_KEY);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const res = await authApi.post("/auth/login", { email, password });

      // ✅ Your authController returns `accessToken`, not `token`
      const { accessToken, data: user } = res.data;

      if (user.role !== "admin") {
        return { success: false, error: "Access denied. Admins only." };
      }

      // ✅ Store with consistent key, no expires (session cookie) — 
      //    access token is short-lived (15m), refresh handled by interceptor
      Cookies.set(TOKEN_KEY, accessToken, { sameSite: "strict" });
      setAdmin(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      return { success: false, error: message };
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    try {
      // ✅ Tell server to clear refresh token too
      await authApi.post(
        "/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${Cookies.get(TOKEN_KEY)}` } }
      );
    } catch {
      // Ignore — clear client side regardless
    } finally {
      Cookies.remove(TOKEN_KEY);
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
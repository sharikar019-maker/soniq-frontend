import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export const AuthContext = createContext();

// Axios instance
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  //  On app start: check if valid token exists 
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = Cookies.get("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch (err) {
        // token expired or invalid — clear it
        Cookies.remove("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromToken();
  }, []);

  //  SIGNUP 
  const signup = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", userData);

      const { token, data } = res.data;

      // store token in cookie — expires in 7 days
      Cookies.set("token", token, { expires: 7 });
      setUser(data);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed";

      if (message.includes("email already")) {
        return { success: false, error: "EMAIL_EXISTS" };
      }

      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  //  LOGIN 
  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      const { token, data } = res.data;

      // store token in cookie — expires in 7 days
      Cookies.set("token", token, { expires: 7 });
      setUser(data);

      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  //  LOGOUT 
  const logout = () => {
    Cookies.remove("token");
    setUser(null);
  };

  
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAdmin,
        api, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
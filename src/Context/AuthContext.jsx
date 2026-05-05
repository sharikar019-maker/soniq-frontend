import { createContext, useState } from "react";

export const AuthContext = createContext();

const API_URL = "http://localhost:5000";

const AuthProvider = ({ children }) => {

  //  Load user from localStorage when app starts
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  // LOGIN 
  const login = async (email, password) => {
    try {
      setLoading(true);

      const normalizedEmail = email.trim().toLowerCase();

      const res = await fetch(`${API_URL}/users?email=${normalizedEmail}`);
      if (!res.ok) throw new Error("Server error");

      const users = await res.json();

      if (users.length === 0) {
        return { success: false, error: "USER_NOT_FOUND" };
      }

      const foundUser = users[0];

      if (foundUser.password !== password) {
        return { success: false, error: "WRONG_PASSWORD" };
      }

      // Save in state
      setUser(foundUser);

      //  Save in localStorage
      localStorage.setItem("user", JSON.stringify(foundUser));

      return { success: true };

    } catch (err) {
      console.error("Login error:", err);
      return { success: false, error: "NETWORK_ERROR" };
    } finally {
      setLoading(false);
    }
  };

  //  SIGNUP 
  const signup = async (userData) => {
    try {
      setLoading(true);

      const normalizedEmail = userData.email.trim().toLowerCase();

      const checkRes = await fetch(
        `${API_URL}/users?email=${normalizedEmail}`
      );

      const existingUsers = await checkRes.json();

      if (existingUsers.length > 0) {
        return { success: false, error: "EMAIL_EXISTS" };
      }

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          email: normalizedEmail,
        }),
      });

      if (!res.ok) throw new Error("Signup failed");

      const newUser = await res.json();

      //  Save in state
      setUser(newUser);

      //  Save in localStorage
      localStorage.setItem("user", JSON.stringify(newUser));

      return { success: true };

    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, error: "NETWORK_ERROR" };
    } finally {
      setLoading(false);
    }
  };

  //  LOGOUT 
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); 
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

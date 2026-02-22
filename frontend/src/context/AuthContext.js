import { createContext, useContext, useState, useEffect } from "react";
import axios from "../api/axios";
import { useToast } from "./ToastContext";

const AuthContext = createContext();

const USER_KEY = "store_rating_user";

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Restore user from localStorage on load (so refresh keeps you logged in)
  useEffect(() => {
    const stored = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem("token");
    if (stored && token) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem("token");
      }
    }
    setAuthChecked(true);
  }, []);

  const setAuthFromResponse = (res) => {
    const token = res.data.token;
    const userData = {
      id: res.data.id,
      name: res.data.name,
      email: res.data.email,
      role: res.data.role,
    };
    localStorage.setItem("token", token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      setAuthFromResponse(res);
      showToast("Login successful", "success");
      window.location.href = "/dashboard";
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed", "error");
    }
  };

  const signup = async (name, email, password, role = "user") => {
    try {
      const res = await axios.post("/auth/signup", { name, email, password, role });
      setAuthFromResponse(res);
      showToast("Account created", "success");
      window.location.href = "/dashboard";
    } catch (err) {
      showToast(err.response?.data?.message || "Signup failed", "error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem(USER_KEY);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, authChecked }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

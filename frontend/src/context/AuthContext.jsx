/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }

    // Handle token from redirect (e.g., after Google auth)
    const query = new URLSearchParams(location.search);
    const redirectToken = query.get("token");
    if (redirectToken) {
      localStorage.setItem("token", redirectToken);
      fetchUser(redirectToken);
      // Clean URL
      navigate("/dashboard", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchUser = async (token) => {
    try {
      setError(null);
      const res = await axios.get(`${API_URL}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError("Failed to load user data. Please try logging in again.");
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);
      return {
        success: true,
        data: res.data,
        message: res.data.message,
      };
    } catch (err) {
      console.error("Registration error:", err);
      return {
        success: false,
        error:
          err.response?.data?.message || "Registrasi gagal. Silakan coba lagi.",
      };
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }

      return { success: false, error: "Login gagal" };
    } catch (err) {
      console.error("Login error:", err);

      // Handle unverified email
      if (err.response?.data?.needsVerification) {
        return {
          success: false,
          needsVerification: true,
          email: err.response.data.email,
          error: err.response.data.message,
        };
      }

      return {
        success: false,
        error: err.response?.data?.message || "Login gagal. Silakan coba lagi.",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/logout`);
    } catch (err) {
      console.error("Logout failed:", err);
    }
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  // Axios interceptor for JWT
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        error,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

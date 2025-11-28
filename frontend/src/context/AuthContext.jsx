import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added for error handling
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
  }, [location]);

  const fetchUser = async (token) => {
    try {
      setError(null); // Clear previous errors
      const res = await axios.get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      setError("Failed to load user data. Please try logging in again."); // Set error message
      logout();
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get("http://localhost:5000/logout");
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
    <AuthContext.Provider value={{ user, setUser, loading, error, logout }}>
      {" "}
      {/* Added setUser */}
      {children}
    </AuthContext.Provider>
  );
};

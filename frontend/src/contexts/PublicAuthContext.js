import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

const PublicAuthContext = createContext(null);

export function PublicAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ame_public_token"));
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      // Ensure we send the public token
      const res = await api.get("/public/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(res.data);
    } catch {
      localStorage.removeItem("ame_public_token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = async (phone, password) => {
    const res = await api.post("/public/auth/login", { phone, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("ame_public_token", newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const register = async (fullName, phone, password) => {
    const res = await api.post("/public/auth/register", { full_name: fullName, phone, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("ame_public_token", newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("ame_public_token");
    setToken(null);
    setUser(null);
  };

  const isProfileComplete = !!(
    user?.full_name && 
    user?.neet_score !== null && 
    user?.neet_score !== undefined &&
    user?.category && 
    user?.gender && 
    user?.district && 
    user?.special_reservation
  );

  return (
    <PublicAuthContext.Provider value={{ user, token, login, register, logout, loading, setUser, isProfileComplete }}>
      {children}
    </PublicAuthContext.Provider>
  );
}

export const usePublicAuth = () => useContext(PublicAuthContext);

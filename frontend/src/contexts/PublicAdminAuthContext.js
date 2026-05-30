import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

const PublicAdminAuthContext = createContext(null);

export function PublicAdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("ame_padmin_token"));
  const [loading, setLoading] = useState(true);

  const fetchAdmin = useCallback(async () => {
    try {
      const res = await api.get("/public-admin/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmin(res.data);
    } catch {
      localStorage.removeItem("ame_padmin_token");
      setToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchAdmin();
    else setLoading(false);
  }, [token, fetchAdmin]);

  const login = async (email, password) => {
    const res = await api.post("/public-admin/auth/login", { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("ame_padmin_token", newToken);
    setToken(newToken);
    setAdmin(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("ame_padmin_token");
    setToken(null);
    setAdmin(null);
  };

  // Helper to get auth header
  const authHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  return (
    <PublicAdminAuthContext.Provider value={{ admin, token, login, logout, loading, authHeader }}>
      {children}
    </PublicAdminAuthContext.Provider>
  );
}

export const usePublicAdmin = () => useContext(PublicAdminAuthContext);

import { useContext, useEffect, useState, createContext } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await api.get("/users/me");
          setUser(data.user);
        } catch (err) {
          console.error("Failed to fetch user", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/users/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-[var(--color-bg)]">
        <div className="w-10 h-10 rounded-full border-3 border-[var(--color-border)] border-t-[var(--color-primary)] animate-spin mb-4" />
        <p className="text-sm text-[var(--color-text-muted)] font-medium">Loading…</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

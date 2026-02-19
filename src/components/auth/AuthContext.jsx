import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dummyUsers } from "../../data/users.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "das_auth_user_v1";

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = safeParse(localStorage.getItem(STORAGE_KEY));
    if (saved?.email && saved?.role) setUser(saved);
  }, []);

  const isAuthenticated = !!user;

  function login({ email, password }) {
    const match = dummyUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!match) {
      return { ok: false, message: "Invalid email or password." };
    }
    const loggedIn = { id: match.id, name: match.name, email: match.email, role: match.role };
    setUser(loggedIn);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn));
    return { ok: true };
  }

  function register({ name, email, password, role }) {
    if (!name || !email || !password || !role) {
      return { ok: false, message: "Please fill all fields." };
    }
    const exists = dummyUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { ok: false, message: "This email already exists in dummy data." };
    }

    const newUser = { id: `u_${Date.now()}`, name, email, role };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { ok: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({ user, isAuthenticated, login, register, logout }),
    [user, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


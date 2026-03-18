import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "operator";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock users
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "admin@traffic.io": {
    password: "admin123",
    user: { id: "1", email: "admin@traffic.io", name: "Admin Control", role: "admin" },
  },
  "operator@traffic.io": {
    password: "op123",
    user: { id: "2", email: "operator@traffic.io", name: "Operator One", role: "operator" },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("traffic_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1200));
    const entry = MOCK_USERS[email.toLowerCase()];
    if (entry && entry.password === password) {
      setUser(entry.user);
      localStorage.setItem("traffic_user", JSON.stringify(entry.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("traffic_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

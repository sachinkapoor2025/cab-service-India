import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: "STUDENT" | "DRIVER";
  emergencyContacts?: string[];
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (role: "STUDENT" | "DRIVER") => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedAuth = localStorage.getItem("isAuthenticated");

    if (storedUser && storedRole && storedAuth === "true") {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ FIXED: login ONLY sets role, does NOT redirect
  const login = (selectedRole: "STUDENT" | "DRIVER") => {
    localStorage.setItem("role", selectedRole);
    setRole(selectedRole);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

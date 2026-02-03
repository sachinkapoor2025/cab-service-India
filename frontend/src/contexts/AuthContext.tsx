import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  COGNITO_AUTH_URL,
  COGNITO_CLIENT_ID,
  REDIRECT_URI,
  LOGOUT_URI,
} from "../config";

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
  if (context === undefined) {
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
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedAuth = localStorage.getItem("isAuthenticated");

    if (storedUser && storedRole && storedAuth === "true") {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (role: "STUDENT" | "DRIVER") => {
    // Build Cognito authorization URL with state parameter
    const state = JSON.stringify({ role });
    const authUrl =
      `${COGNITO_AUTH_URL}/oauth2/authorize?` +
      new URLSearchParams({
        client_id: COGNITO_CLIENT_ID,
        response_type: "code",
        scope: "openid email profile",
        redirect_uri: REDIRECT_URI,
        state: state,
      });

    // Redirect to Cognito
    window.location.href = authUrl;
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("access_token");
    localStorage.removeItem("id_token");
    localStorage.removeItem("refresh_token");

    // Redirect to Cognito logout
    const logoutUrl =
      `${COGNITO_AUTH_URL}/logout?` +
      new URLSearchParams({
        client_id: COGNITO_CLIENT_ID,
        logout_uri: LOGOUT_URI,
      });

    setUser(null);
    setRole(null);
    setIsAuthenticated(false);

    // Redirect to logout page
    window.location.href = logoutUrl;
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    role,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

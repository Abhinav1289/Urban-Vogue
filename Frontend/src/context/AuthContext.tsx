import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../services/apiService"; // Centralized API service

// Define User type
export interface User {
  id: string;
  name: string;
  email: string;
}

// Define AuthContext type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  updateUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user details from backend
  const fetchUser = async () => {
    try {
      const response = await api.get("/Auth/token", { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null); // ✅ Clear user state if the request fails
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update user state manually
  const updateUser = (userData: User | null) => {
    setUser(userData);
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post("/Auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, fetchUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy access
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

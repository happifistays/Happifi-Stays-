import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

const authSessionKey = "_BOOKING_AUTH_KEY_";

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // 1. Initialize state directly from localStorage (Synchronous)
  const [user, setUser] = useState(() => {
    const savedSession = localStorage.getItem(authSessionKey);
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (error) {
        console.error("Error parsing session:", error);
        return null;
      }
    }
    return null;
  });

  const saveSession = (userData) => {
    // Save the whole user object (including token) to localStorage
    localStorage.setItem(authSessionKey, JSON.stringify(userData));
    localStorage.setItem("token", userData.token); // Keep for your axios interceptors
    if (userData.role) localStorage.setItem("role", userData.role);

    setUser(userData);
  };

  const removeSession = () => {
    localStorage.removeItem(authSessionKey);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/auth/sign-in");
  };

  // 2. Remove the useEffect that was clearing the user.
  // It was likely detecting "no cookie" for a split second on refresh
  // and calling setUser(null).

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        saveSession,
        removeSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

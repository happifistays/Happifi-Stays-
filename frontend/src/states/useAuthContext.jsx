import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

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
  const [cookies, setCookie, removeCookie] = useCookies([authSessionKey]);

  const [user, setUser] = useState(() => {
    const savedSession = cookies[authSessionKey];
    if (savedSession) {
      try {
        // Handle both stringified and already parsed objects
        return typeof savedSession === "string"
          ? JSON.parse(savedSession)
          : savedSession;
      } catch (error) {
        console.error("Error parsing session cookie:", error);
        return null;
      }
    }
    return null;
  });

  const saveSession = (userData) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    // Save to Cookie (Primary storage for persistence)
    setCookie(authSessionKey, JSON.stringify(userData), {
      path: "/",
      expires,
      sameSite: "lax",
    });

    // Save to LocalStorage (Secondary storage for token access)
    localStorage.setItem("token", userData.token);

    // Save to State (For immediate UI updates)
    setUser(userData);
  };

  const removeSession = () => {
    removeCookie(authSessionKey, { path: "/" });
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
    navigate("/auth/sign-in");
  };

  // Keep state in sync if cookies are deleted elsewhere
  useEffect(() => {
    if (!cookies[authSessionKey] && user) {
      setUser(null);
    }
  }, [cookies, user]);

  const isAuthenticated = !!user || !!cookies[authSessionKey];

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

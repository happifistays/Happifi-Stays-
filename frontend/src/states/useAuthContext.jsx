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

  // Use a function to initialize state so it only runs once on mount
  const [user, setUser] = useState(() => {
    const savedSession = cookies[authSessionKey];
    if (savedSession) {
      return typeof savedSession === "string"
        ? JSON.parse(savedSession)
        : savedSession;
    }
    return undefined;
  });

  const saveSession = (userData) => {
    // 1. Set a Max-Age (e.g., 7 days) so the cookie persists after closing/refreshing browser
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    setCookie(authSessionKey, JSON.stringify(userData), {
      path: "/",
      expires, // This is crucial
      sameSite: "lax",
    });

    setUser(userData);
    localStorage.setItem("token", userData.token);
  };

  const removeSession = () => {
    removeCookie(authSessionKey, { path: "/" });
    localStorage.removeItem("token");
    setUser(undefined);
    navigate("/auth/sign-in");
  };

  // Sync state if cookies change externally (optional but helpful)
  const isAuthenticated = !!cookies[authSessionKey];

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

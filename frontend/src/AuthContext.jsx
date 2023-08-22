import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || ""
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [userID, setUserID] = useState(localStorage.getItem("userID"));

  const login = (role, userID) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setUserID(userID);
    localStorage.setItem("userRole", role);
    localStorage.setItem("isAuthenticated", true);
    localStorage.setItem("userID", userID);
  };
  console.log(userRole);
  console.log("userID:", userID);
  console.log(isAuthenticated);
  const logout = () => {
    setUserRole("");
    setIsAuthenticated(false);
    setUserID("");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userID");
  };

  return (
    <AuthContext.Provider
      value={{ userRole, isAuthenticated, userID, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

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
  const [userStatus, setUserStatus] = useState(
    localStorage.getItem("userStatus") || ""
  );

  const login = (role, userID, status) => {
    setUserRole(role);

    if (status === "verified") {
      setIsAuthenticated(true);
      setUserID(userID);
      setUserStatus(status);
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("userID", userID);
      localStorage.setItem("userStatus", status);
    }
  };
  console.log(userRole);
  console.log("userID:", userID);
  console.log(isAuthenticated);
  const logout = () => {
    setUserRole("");
    setIsAuthenticated(false);
    setUserID("");
    setUserStatus("");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userID");
    localStorage.removeItem("userStatus");
  };

  return (
    <AuthContext.Provider
      value={{ userRole, isAuthenticated, userID, userStatus, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

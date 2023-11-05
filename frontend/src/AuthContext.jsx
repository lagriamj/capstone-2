/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

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
  const [fullName, setUserFullName] = useState(
    localStorage.getItem("userFullName") || ""
  );

  const login = (role, userID, status, fullName) => {
    setUserRole(role);

    if (status === "verified") {
      setIsAuthenticated(true);
      setUserID(userID);
      setUserStatus(status);
      setUserFullName(fullName);
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("userID", userID);
      localStorage.setItem("userStatus", status);
      localStorage.setItem("userFullName", fullName);
    }
  };
  const logout = () => {
    setUserRole("");
    setIsAuthenticated(false);
    setUserID("");
    setUserStatus("");
    setUserFullName("");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userID");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("userFullName");
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        isAuthenticated,
        userID,
        userStatus,
        fullName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import ForcePasswordChange from "./components/ForcePasswordChange";

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
  const [passwordChange, setPasswordChange] = useState(
    localStorage.getItem("password_change_required") || ""
  );

  const login = (role, userID, status, fullName, password_change_required) => {
    setUserRole(role);

    if (status === "verified") {
      setIsAuthenticated(true);
      setUserID(userID);
      setUserStatus(status);
      setUserFullName(fullName);
      setPasswordChange(password_change_required);
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("userID", userID);
      localStorage.setItem("userStatus", status);
      localStorage.setItem("userFullName", fullName);
      localStorage.setItem(
        "password_change_required",
        password_change_required
      );
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
    localStorage.removeItem("password_change_required");
  };

  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

  useEffect(() => {
    if (passwordChange === 0 || passwordChange === "0") {
      setShowPasswordChangeModal(true);
    }
  }, [passwordChange]);

  const closeChangePasswordModal = () => {
    setShowPasswordChangeModal(false);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const isLargeScreen = windowWidth >= 1024;

  return (
    <AuthContext.Provider
      value={{
        userRole,
        isAuthenticated,
        userID,
        userStatus,
        fullName,
        passwordChange,
        login,
        logout,
      }}
    >
      {children}
      <ForcePasswordChange
        modalVisible={showPasswordChangeModal}
        onClose={closeChangePasswordModal}
        isLargeScreen={isLargeScreen}
      />
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}

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
  const [firstName, setUserFirstName] = useState(
    localStorage.getItem("userFistName") || ""
  );
  const [lastName, setUserLastName] = useState(
    localStorage.getItem("userLastName") || ""
  );

  const login = (role, userID, status, firstName, lastName) => {
    setUserRole(role);

    if (status === "verified") {
      setIsAuthenticated(true);
      setUserID(userID);
      setUserStatus(status);
      setUserFirstName(firstName);
      setUserLastName(lastName);
      localStorage.setItem("userRole", role);
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("userID", userID);
      localStorage.setItem("userStatus", status);
      localStorage.setItem("userFirstName", firstName);
      localStorage.setItem("userLastName", lastName);
    }
  };
  console.log(userRole);
  console.log("userID:", userID);
  console.log(isAuthenticated);
  console.log(firstName);
  console.log(lastName);
  const logout = () => {
    setUserRole("");
    setIsAuthenticated(false);
    setUserID("");
    setUserStatus("");
    setUserFirstName("");
    setUserLastName("");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userID");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("userFirstName");
    localStorage.removeItem("userLastName");
  };

  return (
    <AuthContext.Provider
      value={{
        userRole,
        isAuthenticated,
        userID,
        userStatus,
        firstName,
        lastName,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

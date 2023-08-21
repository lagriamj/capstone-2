import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || ""); 
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");

    const login = (role) => {
        setUserRole(role);
        setIsAuthenticated(true);
        localStorage.setItem("userRole", role);
        localStorage.setItem("isAuthenticated", true);
    };
    console.log(userRole)
    const logout = () => {
        setUserRole("");
        setIsAuthenticated(false);
        localStorage.removeItem("userRole");
        localStorage.removeItem("isAuthenticated");
    };

    return (
        <AuthContext.Provider value={{ userRole, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

import "./App.css";
import "./index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState, useEffect, } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { CombinedProvider, useCombined } from "./CombinedContext";
import Login from "./views/Login";
import Register from  "./views/Register"
import RegisterConfirmation from "./views/RegisterConfirmation";
import NotFound from "./views/NotFound";
import Requests from "./views/user/Requests";
import CurrentRequests from "./views/user/CurrentRequests";
import Transactions from "./views/user/Transactions";
import Account from "./views/user/Account";
import Dashboard from "./views/admin/Dashboard";
import Unauthorized from "./views/Unauthorized";


function App() {

  function ProtectedRoute({ element, requiredRole }) {
    const { userRole, isAuthenticated } = useAuth();
  
    /*if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    if (userRole !== requiredRole) {
      return <Navigate to="/unauthorized" />;
    }*/

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    // If requiredRole is provided and doesn't match user's role, redirect to unauthorized
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/unauthorized" />;
    }
  
    // If user is already authenticated and trying to access login, redirect accordingly
    if (isAuthenticated && element.type === Login) {
      if (userRole === 'admin') {
        return <Navigate to="/dashboard" />;
      } else if (userRole === 'user') {
        return <Navigate to="/request" />;
      }
    }
  
    return element;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login/>} />
          <Route
            path="/verify-otp"
            element={<RegisterConfirmation />}
          />
          {/*<Route path="/request" element={<Requests />} />*/}
          <Route path="/current-requests" element={<CurrentRequests />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/account" element={<Account />} />
          <Route path="/page-not-found" element={<NotFound/>}/>
          <Route path="/unauthorized" element={<Unauthorized/>}/>
          {/*<Route path="/dashboard" element={<Dashboard/>}/>*/}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard/>} requiredRole={'admin'}/>}/>
          <Route path="/request" element={<ProtectedRoute element={<Requests/>} requiredRole={'user'}/>}/>
          {/*<Route path="/dashboard" element={<ProtectedRoute element={Dashboard} requiredRoles={["admin"]} userRole={userRole} />} />*/}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

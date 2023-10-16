/* eslint-disable react/prop-types */
import "./App.css";
import "./index.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./views/Login";
import Register from "./views/Register";
import RegisterConfirmation from "./views/RegisterConfirmation";
import NotFound from "./views/NotFound";
import Requests from "./views/user/Requests";
import CurrentRequests from "./views/user/CurrentRequests";
import Transactions from "./views/user/Transactions";
import Account from "./views/user/Account";
import Dashboard from "./views/admin/Dashboard";
import Unauthorized from "./views/Unauthorized";
import UpdateEmailPage from "./views/UpdateEmailPage";
import ServiceRequest from "./views/admin/ServiceRequest";
import ServiceTask from "./views/admin/ServiceTask";
import AdminAccount from "./views/admin/AdminAccount";
import { ActiveTabProvider } from "./ActiveTabContext";
import UsersList from "./views/admin/UsersList";
import { ActiveSubTabProvider } from "./ActiveSubTabContext";
import OfficeDepartment from "./views/admin/OfficeDepartment";
import Categories from "./views/admin/Categories";
import NatureOfRequest from "./views/admin/NatureOfRequest";
import ApproveRequests from "./views/head/ApproveRequests";
import ApprovedList from "./views/head/ApprovedList";
import HeadAccount from "./views/head/HeadAccount";
import AuditLog from "./views/admin/AuditLog";
import HeadCurrentRequests from "./views/head/HeadCurrentRequests";
import HeadTransactions from "./views/head/HeadTransactions";
import HeadRequests from "./views/head/HeadRequests";
import ForgotPassword from "./views/ForgotPassword";

function App() {
  function ProtectedRoute({ element, requiredRole }) {
    const { userRole, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    // If requiredRole is provided and doesn't match user's role, redirect to unauthorized
    if (requiredRole && userRole !== requiredRole) {
      return <Navigate to="/unauthorized" />;
    }

    // If user is already authenticated and trying to access login, redirect accordingly
    if (isAuthenticated && element.type === Login) {
      if (userRole === "admin") {
        return <Navigate to="/dashboard" />;
      } else if (userRole === "user") {
        return <Navigate to="/request" />;
      } else if (userRole === "head") {
        return <Navigate to="/head/request" />;
      }
    }

    return element;
  }

  return (
    <AuthProvider>
      <BrowserRouter>
        <ActiveTabProvider>
          <ActiveSubTabProvider>
            <Routes>
              <Route path="*" element={<NotFound />} />
              <Route index element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<RegisterConfirmation />} />
              <Route path="/update-email" element={<UpdateEmailPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/page-not-found" element={<NotFound />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* User Routes */}
              <Route
                path="/request"
                element={
                  <ProtectedRoute
                    element={<Requests />}
                    requiredRole={"user"}
                  />
                }
              />
              <Route
                path="/current-requests"
                element={
                  <ProtectedRoute
                    element={<CurrentRequests />}
                    requiredRole={"user"}
                  />
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute
                    element={<Transactions />}
                    requiredRole={"user"}
                  />
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute element={<Account />} requiredRole={"user"} />
                }
              />

              {/* Head Routes */}
              <Route
                path="/approve-requests"
                element={
                  <ProtectedRoute
                    element={<ApproveRequests />}
                    requiredRole={"head"}
                  />
                }
              />
              <Route
                path="/approved-list"
                element={
                  <ProtectedRoute
                    element={<ApprovedList />}
                    requiredRole={"head"}
                  />
                }
              />
              <Route
                path="/head/account"
                element={
                  <ProtectedRoute
                    element={<HeadAccount />}
                    requiredRole={"head"}
                  />
                }
              />
              <Route
                path="/head/current-requests"
                element={
                  <ProtectedRoute
                    element={<HeadCurrentRequests />}
                    requiredRole={"head"}
                  />
                }
              />
              <Route
                path="/head/transactions"
                element={
                  <ProtectedRoute
                    element={<HeadTransactions />}
                    requiredRole={"head"}
                  />
                }
              />
              <Route
                path="/head/request"
                element={
                  <ProtectedRoute
                    element={<HeadRequests />}
                    requiredRole={"head"}
                  />
                }
              />

              {/* Admin Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute
                    element={<Dashboard />}
                    requiredRole={"admin"}
                  />
                }
              />
              <Route
                path="/service-request"
                element={
                  <ProtectedRoute
                    element={<ServiceRequest />}
                    requiredRole={"admin"}
                  />
                }
              />
              <Route
                path="/service-task"
                element={
                  <ProtectedRoute
                    element={<ServiceTask />}
                    requiredRole={"admin"}
                  />
                }
              />
              <Route
                path="/admin/account"
                element={
                  <ProtectedRoute
                    element={<AdminAccount />}
                    requiredRole={"admin"}
                  />
                }
              />
              <Route
                path="/users-list"
                element={
                  <ProtectedRoute
                    element={<UsersList />}
                    requiredRole={"admin"}
                  />
                }
              />
              <Route
                path="/admin/departments"
                element={
                  <ProtectedRoute
                    element={<OfficeDepartment />}
                    requiredRole={"admin"}
                  />
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute
                    element={<Categories />}
                    requiredRole={"admin"}
                  />
                }
              />
              <Route
                path="/admin/nature-of-requests"
                element={
                  <ProtectedRoute
                    element={<NatureOfRequest />}
                    requiredRole={"admin"}
                  />
                }
              />
              <Route
                path="/admin/audit-log"
                element={
                  <ProtectedRoute
                    element={<AuditLog />}
                    requiredRole={"admin"}
                  />
                }
              />
            </Routes>
          </ActiveSubTabProvider>
        </ActiveTabProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

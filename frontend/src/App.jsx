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
import UpdatePhoneNumberPage from "./views/UpdatePhoneNumberPage";
import ServiceRequest from "./views/admin/ServiceRequest";
import ReceiveService from "./views/admin/ReceiveService";
import ServiceTask from "./views/admin/ServiceTask";
import ServiceTransaction from "./views/admin/ServiceTransaction";
import Recommendation from "./views/admin/Recommendation";
import AdminAccount from "./views/admin/AdminAccount";
import { ActiveTabProvider } from "./ActiveTabContext";
import UsersList from "./views/admin/UsersList";
import { ActiveSubTabProvider } from "./ActiveSubTabContext";
import OfficeDepartment from "./views/admin/OfficeDepartment";
import Categories from "./views/admin/Categories";
import NatureOfRequest from "./views/admin/NatureOfRequest";
import Technicians from "./views/admin/Technicians";

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
              <Route index element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/verify-otp" element={<RegisterConfirmation />} />
              <Route path="/update-phone" element={<UpdatePhoneNumberPage />} />
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
                path="/receive-service"
                element={
                  <ProtectedRoute
                    element={<ReceiveService />}
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
                path="/service-transaction"
                element={
                  <ProtectedRoute
                    element={<ServiceTransaction />}
                    requiredRole={"admin"}
                  />
                }
              />
              <Route
                path="/recommendation"
                element={
                  <ProtectedRoute
                    element={<Recommendation />}
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
                path="/admin/technicians"
                element={
                  <ProtectedRoute
                    element={<Technicians />}
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

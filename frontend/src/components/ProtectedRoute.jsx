import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function ProtectedRoute({ element: Element, requiredRole }) {
  const { userRole, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect unauthorized users to the login page
    return <Navigate to="/login" />;
  }

  if (requiredRole === 'admin' && userRole !== 'admin') {
    // Redirect non-admin users from admin-only routes
    return <Navigate to="/unauthorized" />;
  }

  if (requiredRole === 'user' && userRole !== 'user') {
    // Redirect non-user users from user-only routes
    return <Navigate to="/unauthorized" />;
  }

  // Allow authorized users to access the route
  return <Element />;
}

export default ProtectedRoute;

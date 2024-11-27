import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isLoginRoute }) {
  const token = localStorage.getItem('token');

  // If the user is already authenticated and tries to access the login page, redirect to home
  if (isLoginRoute && token) {
    return <Navigate to="/" />;
  }

  // If no token, redirect to login page for protected routes
  if (!token && !isLoginRoute) {
    return <Navigate to="/login" />;
  }

  // Render the protected content if token exists or if it's the login route
  return children;
}

export default ProtectedRoute;

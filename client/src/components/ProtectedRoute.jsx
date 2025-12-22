/* client/src/components/ProtectedRoute.jsx */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // SECURITY UPDATE: Check SESSION STORAGE
  const token = sessionStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
/* client/src/components/PublicRoute.jsx */
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getHomeRoute } from '../utils/roleRedirect'; // <--- Import logic

const PublicRoute = () => {
  const token = sessionStorage.getItem('access_token');
  const role = sessionStorage.getItem('user_role');

  // If user is ALREADY logged in, force them to their SPECIFIC Dashboard
  if (token && role) {
    const targetPath = getHomeRoute(role);
    return <Navigate to={targetPath} replace />;
  }

  // Otherwise, let them see the Login page
  return <Outlet />;
};

export default PublicRoute;
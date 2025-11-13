
/**
 * @author: S M Samiul Hasan
 * @file: ProtectedRoute.jsx
 * @description: This component protects routes from unauthenticated users.
 * All rights reserved by S M Samiul Hasan.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {

    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
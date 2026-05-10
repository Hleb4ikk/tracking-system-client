import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { ROUTES } from '../constants';
import { LoadingOverlay } from '../components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, isInitialized } = useAuthStore();
  const location = useLocation();

  // Wait for auth check to complete
  if (!isInitialized || isLoading) {
    return <LoadingOverlay message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

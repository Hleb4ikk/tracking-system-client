import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { ROUTES } from '../constants';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    // User doesn't have required role
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            403
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Access Denied
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

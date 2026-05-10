import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { ROUTES } from '../constants';

interface CompanyRequiredRouteProps {
  children: React.ReactNode;
}

export const CompanyRequiredRoute: React.FC<CompanyRequiredRouteProps> = ({ children }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user?.company_id) {
    return <Navigate to={ROUTES.COMPANY_ONBOARDING} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { ProtectedRoute } from './ProtectedRoute';
import { CompanyRequiredRoute } from './CompanyRequiredRoute';
import { AuthLayout, AppLayout } from '../components/layout';
import { LoginPage, RegisterPage } from '../pages/auth';
import { DashboardPage } from '../pages/dashboard';
import { CompanyOnboardingPage, InvitationsPage, CompanySettingsPage } from '../pages/company';
import { OrdersListPage } from '../pages/orders';
import { CargosListPage } from '../pages/cargos';
import { SupplyNodesListPage } from '../pages/supply-nodes';
import { SupplyChainsListPage } from '../pages/supply-chains';
import { VehiclesListPage } from '../pages/vehicles';
import { ReceiversListPage } from '../pages/receivers';

// Root redirect component that checks auth state
const RootRedirect = () => {
  return <Navigate to={ROUTES.DASHBOARD} replace />;
};

// Placeholder components for routes we'll create later
const ProfilePage = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Profile</h1>
    <p className="text-gray-600 dark:text-gray-400">Profile module coming in Phase 12</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: ROUTES.COMPANY_ONBOARDING,
    element: (
      <ProtectedRoute>
        <CompanyOnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <CompanyRequiredRoute>
          <AppLayout />
        </CompanyRequiredRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: ROUTES.ORDERS,
        element: <OrdersListPage />,
      },
      {
        path: ROUTES.CARGOS,
        element: <CargosListPage />,
      },
      {
        path: ROUTES.VEHICLES,
        element: <VehiclesListPage />,
      },
      {
        path: ROUTES.SUPPLY_NODES,
        element: <SupplyNodesListPage />,
      },
      {
        path: ROUTES.SUPPLY_CHAINS,
        element: <SupplyChainsListPage />,
      },
      {
        path: ROUTES.RECEIVERS,
        element: <ReceiversListPage />,
      },
      {
        path: ROUTES.COMPANY,
        element: <CompanySettingsPage />,
      },
      {
        path: ROUTES.COMPANY_INVITATIONS,
        element: <InvitationsPage />,
      },
      {
        path: ROUTES.COMPANY_SETTINGS,
        element: <CompanySettingsPage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.PROFILE_EDIT,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.PROFILE_SECURITY,
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">404</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Page not found</p>
        </div>
      </div>
    ),
  },
]);

export * from './ProtectedRoute';
export * from './RoleBasedRoute';
export * from './CompanyRequiredRoute';

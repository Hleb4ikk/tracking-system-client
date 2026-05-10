import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { ProtectedRoute } from './ProtectedRoute';
import { CompanyRequiredRoute } from './CompanyRequiredRoute';
import { AuthLayout, AppLayout } from '../components/layout';
import { LoginPage, RegisterPage } from '../pages/auth';
import { DashboardPage } from '../pages/dashboard';
import { CompanyOnboardingPage, InvitationsPage } from '../pages/company';
import { OrdersListPage } from '../pages/orders';

// Placeholder components for routes we'll create later
const CargosPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Cargos</h1>
    <p className="text-gray-600 dark:text-gray-400">Cargos module coming in Phase 6</p>
  </div>
);

const VehiclesPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vehicles</h1>
    <p className="text-gray-600 dark:text-gray-400">Vehicles module coming in Phase 9</p>
  </div>
);

const SupplyChainsPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Supply Chains</h1>
    <p className="text-gray-600 dark:text-gray-400">Supply Chains module coming in Phase 7</p>
  </div>
);

const SupplyNodesPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Supply Nodes</h1>
    <p className="text-gray-600 dark:text-gray-400">Supply Nodes module coming in Phase 8</p>
  </div>
);

const ReceiversPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Receivers</h1>
    <p className="text-gray-600 dark:text-gray-400">Receivers module coming in Phase 10</p>
  </div>
);

const CompanyPage = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Company</h1>
    <p className="text-gray-600 dark:text-gray-400">Company module coming in Phase 11</p>
  </div>
);

const ProfilePage = () => (
  <div>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Profile</h1>
    <p className="text-gray-600 dark:text-gray-400">Profile module coming in Phase 12</p>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
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
        element: <CargosPage />,
      },
      {
        path: ROUTES.VEHICLES,
        element: <VehiclesPage />,
      },
      {
        path: ROUTES.SUPPLY_CHAINS,
        element: <SupplyChainsPage />,
      },
      {
        path: ROUTES.SUPPLY_NODES,
        element: <SupplyNodesPage />,
      },
      {
        path: ROUTES.RECEIVERS,
        element: <ReceiversPage />,
      },
      {
        path: ROUTES.COMPANY,
        element: <CompanyPage />,
      },
      {
        path: ROUTES.COMPANY_TEAM,
        element: <CompanyPage />,
      },
      {
        path: ROUTES.COMPANY_INVITATIONS,
        element: <InvitationsPage />,
      },
      {
        path: ROUTES.COMPANY_SETTINGS,
        element: <CompanyPage />,
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

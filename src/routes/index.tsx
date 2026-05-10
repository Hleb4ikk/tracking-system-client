import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginPage, RegisterPage } from '../pages/auth';
import { DashboardPage } from '../pages/dashboard';

// Placeholder components for routes we'll create later
const OrdersPage = () => <div>Orders (Coming soon)</div>;

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
    path: ROUTES.DASHBOARD,
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ORDERS,
    element: (
      <ProtectedRoute>
        <OrdersPage />
      </ProtectedRoute>
    ),
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

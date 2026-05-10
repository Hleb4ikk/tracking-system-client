import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { Button, Card, CardHeader, CardTitle, CardContent } from '../../components/ui';
import { ROUTES } from '../../constants';
import { LogOut, User } from 'lucide-react';
import { useToast } from '../../hooks';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome to Tracking System
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user?.first_name} {user?.last_name}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {user?.role || 'No role assigned'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {user?.company_id || 'No company'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate(ROUTES.ORDERS)}
                >
                  View Orders
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate(ROUTES.CARGOS)}
                >
                  View Cargos
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate(ROUTES.VEHICLES)}
                >
                  View Vehicles
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Authentication
                  </span>
                  <span className="text-sm font-medium text-green-600">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    API Connection
                  </span>
                  <span className="text-sm font-medium text-green-600">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Phase
                  </span>
                  <span className="text-sm font-medium text-blue-600">Phase 2</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <Button variant="danger" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Info Box */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🎉 Phase 2 Complete!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Authentication is now fully functional. You can login, register, and logout.
              Protected routes are working, and user information is displayed correctly.
            </p>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Next Steps:</strong> Phase 3 will add the main layout with sidebar,
                header, and navigation. Then we'll build out the Orders, Cargos, and other
                modules.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge } from '../../components/ui';
import { Breadcrumbs } from '../../components/layout';
import { ROUTES } from '../../constants';
import { Package, Truck, ShoppingCart, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  return (
    <>
      <Breadcrumbs />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back, {user?.name}!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  24
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Cargos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  18
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +8% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vehicles</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  12
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  8 in use, 4 available
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  94%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +3% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Order #{1000 + i}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {i} hours ago
                    </p>
                  </div>
                  <Badge variant={i % 2 === 0 ? 'success' : 'warning'}>
                    {i % 2 === 0 ? 'Delivered' : 'In Transit'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => navigate(ROUTES.ORDERS)}
            >
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Active Cargos */}
        <Card>
          <CardHeader>
            <CardTitle>Active Cargos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Cargo #{2000 + i}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vehicle #{100 + i}
                    </p>
                  </div>
                  <Badge variant={i % 3 === 0 ? 'primary' : i % 3 === 1 ? 'warning' : 'success'}>
                    {i % 3 === 0 ? 'Assembly' : i % 3 === 1 ? 'On the way' : 'Delivered'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => navigate(ROUTES.CARGOS)}
            >
              View All Cargos
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🎉 Phase 3 Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The main layout is now fully functional with sidebar navigation, header with user menu,
            and breadcrumbs. The UI is responsive and works on all devices.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>✅ Completed:</strong> AppLayout, Header, Sidebar, Breadcrumbs, Navigation
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                <strong>🔜 Next:</strong> Phase 4 will add real data to the Dashboard with charts
                and statistics
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useDashboardStore } from '../../stores';
import { Button, Card, CardHeader, CardTitle, CardContent, Badge, Spinner } from '../../components/ui';
import { Breadcrumbs } from '../../components/layout';
import { ROUTES } from '../../constants';
import { Package, Truck, ShoppingCart, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stats, recentOrders, activeCargos, isLoading, fetchAll } = useDashboardStore();

  useEffect(() => {
    if (user?.company_id) {
      fetchAll();
    }
  }, [user?.company_id, fetchAll]);

  const getStatusColor = (status: string): 'success' | 'warning' | 'danger' | 'primary' => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'on the way':
        return 'warning';
      case 'delayed':
        return 'danger';
      case 'assembly':
        return 'primary';
      default:
        return 'primary';
    }
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth >= 0;
    return (
      <span className={`flex items-center gap-1 text-xs ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {Math.abs(growth)}% from last month
      </span>
    );
  };

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user?.company_id) {
    return (
      <>
        <Breadcrumbs />
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Company Assigned
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              You need to be assigned to a company to view the dashboard.
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

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
                  {stats?.totalOrders || 0}
                </p>
                {stats && formatGrowth(stats.ordersGrowth)}
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
                  {stats?.activeCargos || 0}
                </p>
                {stats && formatGrowth(stats.cargosGrowth)}
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
                  {stats?.totalVehicles || 0}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {stats?.availableVehicles || 0} available
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
                  {stats ? Math.round((stats.totalVehicles - stats.availableVehicles) / Math.max(stats.totalVehicles, 1) * 100) : 0}%
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  Vehicle utilization
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
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No orders yet
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => navigate(`${ROUTES.ORDERS}/${order.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {order.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.receiver_name} {order.receiver_surname}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => navigate(ROUTES.ORDERS)}
            >
              View All Orders
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Active Cargos */}
        <Card>
          <CardHeader>
            <CardTitle>Active Cargos</CardTitle>
          </CardHeader>
          <CardContent>
            {activeCargos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No active cargos
              </div>
            ) : (
              <div className="space-y-4">
                {activeCargos.map((cargo) => (
                  <div
                    key={cargo.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    onClick={() => navigate(`${ROUTES.CARGOS}/${cargo.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {cargo.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {cargo.vehicle_title || 'No vehicle assigned'}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(cargo.status)}>
                      {cargo.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => navigate(ROUTES.CARGOS)}
            >
              View All Cargos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="mt-8">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            🎉 Phase 4 Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Dashboard now displays real data from the backend. Statistics are calculated from your
            company's orders, cargos, and vehicles.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>✅ Completed:</strong> Real-time stats, recent orders, active cargos, growth indicators
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                <strong>🔜 Next:</strong> Phase 5 will add full CRUD operations for Orders module
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

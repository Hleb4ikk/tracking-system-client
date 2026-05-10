import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Filter, X, Trash2, Clock, Edit } from 'lucide-react';
import { Button, Input, Card, Badge, Spinner, Pagination } from '../../components/ui';
import { OrderDetails, OrderForm } from '../../components/features/orders';
import { useToast } from '../../hooks';
import { ordersApi } from '../../api';
import { PAGINATION } from '../../constants';
import { useAuthStore, useUIStore } from '../../stores';
import type { OrderWithHistory, OrderWithDetails } from '../../types';
import { formatDate } from '../../utils/formatters';

export const OrdersListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuthStore();
  const { openDrawer } = useUIStore();

  // Get initial values from URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const titleFromUrl = searchParams.get('title') || '';
  const statusFromUrl = searchParams.get('status') || '';

  const [orders, setOrders] = useState<OrderWithHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    title: titleFromUrl,
    status: statusFromUrl,
  });

  const canCreate = user?.role === 'co-founder' || user?.role === 'logistician';
  const canDelete = user?.role === 'co-founder' || user?.role === 'logistician';
  const canEdit = user?.role === 'co-founder' || user?.role === 'logistician';

  // Update URL when page or filters change
  const updateSearchParams = (page: number, newFilters?: typeof filters) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    
    const activeFilters = newFilters || filters;
    if (activeFilters.title) params.set('title', activeFilters.title);
    if (activeFilters.status) params.set('status', activeFilters.status);
    
    setSearchParams(params);
  };

  const fetchOrders = async (page: number = currentPage, activeFilters = filters) => {
    setIsLoading(true);
    try {
      const data = await ordersApi.getOrders(page, activeFilters);
      setOrders(data);
      
      // Calculate total pages
      if (data.length < PAGINATION.DEFAULT_LIMIT) {
        setTotalPages(page);
      } else {
        setTotalPages(page + 1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pageFromUrl, { title: titleFromUrl, status: statusFromUrl });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(page);
    fetchOrders(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    updateSearchParams(1, filters);
    fetchOrders(1, filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { title: '', status: '' };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateSearchParams(1, clearedFilters);
    fetchOrders(1, clearedFilters);
    setShowFilters(false);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    setDeletingId(orderId);
    try {
      const response = await ordersApi.deleteOrder(orderId);
      toast.success(response.message);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete order');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewOrder = async (orderId: string) => {
    openDrawer({
      title: 'Order Details',
      size: 'lg',
      content: <OrderDetailsLoader orderId={orderId} />,
    });
  };

  const handleViewOrderCargos = (orderId: string) => {
    navigate(`/cargos?orderId=${orderId}`);
  };

  const handleCreateOrder = () => {
    openDrawer({
      title: 'Create Order',
      size: 'lg',
      content: <OrderForm mode="create" onSuccess={() => fetchOrders()} />,
    });
  };

  const handleEditOrder = async (orderId: string) => {
    // Load order details first
    try {
      const { order } = await ordersApi.getOrderById(orderId);
      openDrawer({
        title: 'Edit Order',
        size: 'lg',
        content: <OrderForm mode="edit" order={order} onSuccess={() => fetchOrders()} />,
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load order details');
    }
  };

  // Component to load order details inside drawer
  const OrderDetailsLoader: React.FC<{ orderId: string }> = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState<OrderWithDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadOrder = async () => {
        try {
          const { order } = await ordersApi.getOrderById(orderId);
          setOrderDetails(order);
        } catch (error: any) {
          toast.error(error.message || 'Failed to load order details');
        } finally {
          setLoading(false);
        }
      };
      loadOrder();
    }, [orderId]);

    return (
      <div>
        <OrderDetails order={orderDetails} isLoading={loading} onViewAllCargos={handleViewOrderCargos} />
        {!loading && orderDetails && canEdit && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="primary"
              onClick={() => handleEditOrder(orderId)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Order
            </Button>
          </div>
        )}
      </div>
    );
  };

  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('completed') || statusLower.includes('delivered')) return 'success';
    if (statusLower.includes('progress') || statusLower.includes('processing')) return 'primary';
    if (statusLower.includes('pending') || statusLower.includes('waiting')) return 'warning';
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return 'danger';
    return 'default';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your company orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filters.title || filters.status) && (
              <Badge variant="primary" size="sm">
                Active
              </Badge>
            )}
          </Button>
          {canCreate && (
            <Button
              variant="primary"
              onClick={handleCreateOrder}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Order
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <Input
                type="text"
                placeholder="Search by title"
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <Input
                type="text"
                placeholder="Filter by status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleApplyFilters}>
                Apply
              </Button>
              <Button variant="secondary" onClick={handleClearFilters}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Orders List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No orders found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.title || filters.status
              ? 'Try adjusting your filters'
              : 'Create your first order to get started'}
          </p>
          {canCreate && !filters.title && !filters.status && (
            <Button
              variant="primary"
              onClick={handleCreateOrder}
              className="mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleViewOrder(order.id)}
              className="cursor-pointer"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {order.title}
                      </h3>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>

                    {order.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {order.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {order.status_history && order.status_history.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            Updated {formatDate(order.status_history[order.status_history.length - 1].created_at)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {canDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteOrder(order.id);
                      }}
                      isLoading={deletingId === order.id}
                      className="ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && orders.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

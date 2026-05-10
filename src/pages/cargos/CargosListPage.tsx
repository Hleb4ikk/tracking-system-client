import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Package, Plus, Filter, X, Trash2, Clock, Edit } from 'lucide-react';
import { Button, Input, Card, Badge, Spinner, Pagination } from '../../components/ui';
import { CargoDetails, CargoForm } from '../../components/features/cargos';
import { useToast } from '../../hooks';
import { cargosApi } from '../../api';
import { PAGINATION, CARGO_STATUS } from '../../constants';
import { useAuthStore, useUIStore } from '../../stores';
import type { Cargo } from '../../types';
import { formatDate } from '../../utils/formatters';

export const CargosListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const { user } = useAuthStore();
  const { openDrawer } = useUIStore();

  // Get initial values from URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const titleFromUrl = searchParams.get('title') || '';
  const statusFromUrl = searchParams.get('status') || '';
  const supplyNodeConnectionIdFromUrl = searchParams.get('supplyNodeConnectionId') || '';
  const orderIdFromUrl = searchParams.get('orderId') || '';

  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(!!supplyNodeConnectionIdFromUrl || !!orderIdFromUrl);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    title: titleFromUrl,
    status: statusFromUrl,
    supplyNodeConnectionId: supplyNodeConnectionIdFromUrl,
    orderId: orderIdFromUrl,
  });

  const canCreate = user?.role === 'co-founder' || user?.role === 'logistician';
  const canDelete = user?.role === 'co-founder' || user?.role === 'logistician';
  const canEdit = user?.role === 'co-founder' || user?.role === 'logistician' || user?.role === 'expeditor';

  // Update URL when page or filters change
  const updateSearchParams = (page: number, newFilters?: typeof filters) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    
    const activeFilters = newFilters || filters;
    if (activeFilters.title) params.set('title', activeFilters.title);
    if (activeFilters.status) params.set('status', activeFilters.status);
    if (activeFilters.supplyNodeConnectionId) params.set('supplyNodeConnectionId', activeFilters.supplyNodeConnectionId);
    if (activeFilters.orderId) params.set('orderId', activeFilters.orderId);
    
    setSearchParams(params);
  };

  const fetchCargos = async (page: number = currentPage, activeFilters = filters) => {
    setIsLoading(true);
    try {
      const apiFilters: any = {};
      if (activeFilters.status) apiFilters.status = activeFilters.status;
      if (activeFilters.supplyNodeConnectionId) apiFilters.supplyNodeConnectionId = activeFilters.supplyNodeConnectionId;
      if (activeFilters.orderId) apiFilters.orderId = activeFilters.orderId;
      
      const data = await cargosApi.getCargos(page, apiFilters);
      setCargos(data);
      
      // Calculate total pages
      if (data.length < PAGINATION.DEFAULT_LIMIT) {
        setTotalPages(page);
      } else {
        setTotalPages(page + 1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load cargos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCargos(pageFromUrl, { title: titleFromUrl, status: statusFromUrl, supplyNodeConnectionId: supplyNodeConnectionIdFromUrl, orderId: orderIdFromUrl });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(page);
    fetchCargos(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    updateSearchParams(1, filters);
    fetchCargos(1, filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { title: '', status: '', supplyNodeConnectionId: '', orderId: '' };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateSearchParams(1, clearedFilters);
    fetchCargos(1, clearedFilters);
    setShowFilters(false);
  };

  const handleDeleteCargo = async (cargoId: string) => {
    if (!confirm('Are you sure you want to delete this cargo?')) {
      return;
    }

    setDeletingId(cargoId);
    try {
      const response = await cargosApi.deleteCargo(cargoId);
      toast.success(response.message);
      fetchCargos();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete cargo');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewCargo = (cargo: Cargo) => {
    openDrawer({
      title: 'Cargo Details',
      size: 'lg',
      content: (
        <div>
          <CargoDetails cargo={cargo} isLoading={false} />
          {canEdit && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="primary"
                onClick={() => handleEditCargo(cargo)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Cargo
              </Button>
            </div>
          )}
        </div>
      ),
    });
  };

  const handleCreateCargo = () => {
    openDrawer({
      title: 'Create Cargo',
      size: 'lg',
      content: <CargoForm mode="create" onSuccess={() => fetchCargos()} />,
    });
  };

  const handleEditCargo = (cargo: Cargo) => {
    openDrawer({
      title: 'Edit Cargo',
      size: 'lg',
      content: <CargoForm mode="edit" cargo={cargo} onSuccess={() => fetchCargos()} />,
    });
  };



  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case CARGO_STATUS.DELIVERED:
        return 'success';
      case CARGO_STATUS.ON_THE_WAY:
        return 'primary';
      case CARGO_STATUS.ASSEMBLY:
        return 'warning';
      case CARGO_STATUS.DELAYED:
        return 'danger';
      default:
        return 'default';
    }
  };

  // Client-side filtering by title (since API doesn't support it)
  const filteredCargos = cargos.filter((cargo) => {
    if (filters.title && !cargo.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Cargos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your company cargos
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
            {(filters.title || filters.status || filters.orderId || filters.supplyNodeConnectionId) && (
              <Badge variant="primary" size="sm">
                Active
              </Badge>
            )}
          </Button>
          {canCreate && (
            <Button
              variant="primary"
              onClick={handleCreateCargo}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Cargo
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
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All statuses</option>
                <option value={CARGO_STATUS.ASSEMBLY}>Assembly</option>
                <option value={CARGO_STATUS.ON_THE_WAY}>On the way</option>
                <option value={CARGO_STATUS.DELAYED}>Delayed</option>
                <option value={CARGO_STATUS.DELIVERED}>Delivered</option>
              </select>
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

      {/* Active Filter Info */}
      {(filters.orderId || filters.supplyNodeConnectionId) && (
        <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {filters.orderId && 'Filtered by Order'}
                {filters.orderId && filters.supplyNodeConnectionId && ' and '}
                {filters.supplyNodeConnectionId && 'Filtered by Supply Connection'}
              </span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleClearFilters}
              className="flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </Button>
          </div>
        </Card>
      )}

      {/* Cargos List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredCargos.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No cargos found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.title || filters.status
              ? 'Try adjusting your filters'
              : 'Create your first cargo to get started'}
          </p>
          {canCreate && !filters.title && !filters.status && (
            <Button
              variant="primary"
              onClick={handleCreateCargo}
              className="mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Cargo
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCargos.map((cargo) => (
            <div
              key={cargo.id}
              onClick={() => handleViewCargo(cargo)}
              className="cursor-pointer"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {cargo.title}
                      </h3>
                      <Badge variant={getStatusColor(cargo.status)}>
                        {cargo.status}
                      </Badge>
                    </div>

                    {cargo.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {cargo.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          Updated {formatDate(cargo.updated_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {canDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCargo(cargo.id);
                      }}
                      isLoading={deletingId === cargo.id}
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
      {!isLoading && filteredCargos.length > 0 && (
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

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, Plus, Filter, X, Trash2, Edit, Ship, Plane } from 'lucide-react';
import { Button, Input, Card, Badge, Spinner, Pagination } from '../../components/ui';
import { VehicleDetails, VehicleForm } from '../../components/features/vehicles';
import { useToast } from '../../hooks';
import { vehiclesApi } from '../../api';
import { PAGINATION, DELIVERY_TYPE } from '../../constants';
import { useAuthStore, useUIStore } from '../../stores';
import type { Vehicle } from '../../types';

export const VehiclesListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const { user } = useAuthStore();
  const { openDrawer } = useUIStore();

  // Get initial values from URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const titleFromUrl = searchParams.get('title') || '';
  const deliveryTypeFromUrl = searchParams.get('deliveryType') || '';

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    title: titleFromUrl,
    deliveryType: deliveryTypeFromUrl,
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
    if (activeFilters.deliveryType) params.set('deliveryType', activeFilters.deliveryType);
    
    setSearchParams(params);
  };

  const fetchVehicles = async (page: number = currentPage, activeFilters = filters) => {
    setIsLoading(true);
    try {
      const apiFilters: any = {};
      if (activeFilters.deliveryType) apiFilters.deliveryType = activeFilters.deliveryType;
      
      const data = await vehiclesApi.getVehicles(page, apiFilters);
      setVehicles(data);
      
      // Calculate total pages
      if (data.length < PAGINATION.DEFAULT_LIMIT) {
        setTotalPages(page);
      } else {
        setTotalPages(page + 1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load vehicles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles(pageFromUrl, { title: titleFromUrl, deliveryType: deliveryTypeFromUrl });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(page);
    fetchVehicles(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    updateSearchParams(1, filters);
    fetchVehicles(1, filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { title: '', deliveryType: '' };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateSearchParams(1, clearedFilters);
    fetchVehicles(1, clearedFilters);
    setShowFilters(false);
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    setDeletingId(vehicleId);
    try {
      const response = await vehiclesApi.deleteVehicle(vehicleId);
      toast.success(response.message);
      fetchVehicles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete vehicle');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewVehicle = (vehicle: Vehicle) => {
    openDrawer({
      title: 'Vehicle Details',
      size: 'lg',
      content: (
        <div>
          <VehicleDetails vehicle={vehicle} isLoading={false} />
          {canEdit && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="primary"
                onClick={() => handleEditVehicle(vehicle)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Vehicle
              </Button>
            </div>
          )}
        </div>
      ),
    });
  };

  const handleCreateVehicle = () => {
    openDrawer({
      title: 'Create Vehicle',
      size: 'lg',
      content: <VehicleForm mode="create" onSuccess={() => fetchVehicles()} />,
    });
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    openDrawer({
      title: 'Edit Vehicle',
      size: 'lg',
      content: <VehicleForm mode="edit" vehicle={vehicle} onSuccess={() => fetchVehicles()} />,
    });
  };

  const getDeliveryTypeIcon = (type: string) => {
    switch (type) {
      case DELIVERY_TYPE.LAND:
        return <Truck className="w-5 h-5 text-blue-600" />;
      case DELIVERY_TYPE.WATER:
        return <Ship className="w-5 h-5 text-cyan-600" />;
      case DELIVERY_TYPE.AIR:
        return <Plane className="w-5 h-5 text-purple-600" />;
      default:
        return <Truck className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDeliveryTypeBadgeColor = (type: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' => {
    switch (type) {
      case DELIVERY_TYPE.LAND:
        return 'primary';
      case DELIVERY_TYPE.WATER:
        return 'success';
      case DELIVERY_TYPE.AIR:
        return 'warning';
      default:
        return 'default';
    }
  };

  const getDeliveryTypeLabel = (type: string) => {
    switch (type) {
      case DELIVERY_TYPE.LAND:
        return 'Land';
      case DELIVERY_TYPE.WATER:
        return 'Water';
      case DELIVERY_TYPE.AIR:
        return 'Air';
      default:
        return type;
    }
  };

  // Client-side filtering by title (since API doesn't support it)
  const filteredVehicles = vehicles.filter((vehicle) => {
    if (filters.title && !vehicle.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vehicles</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your company vehicles
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
            {(filters.title || filters.deliveryType) && (
              <Badge variant="primary" size="sm">
                Active
              </Badge>
            )}
          </Button>
          {canCreate && (
            <Button
              variant="primary"
              onClick={handleCreateVehicle}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Vehicle
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
                Delivery Type
              </label>
              <select
                value={filters.deliveryType}
                onChange={(e) => setFilters({ ...filters, deliveryType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All types</option>
                <option value={DELIVERY_TYPE.LAND}>🚚 Land</option>
                <option value={DELIVERY_TYPE.WATER}>🚢 Water</option>
                <option value={DELIVERY_TYPE.AIR}>✈️ Air</option>
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

      {/* Vehicles List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredVehicles.length === 0 ? (
        <Card className="p-12 text-center">
          <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No vehicles found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.title || filters.deliveryType
              ? 'Try adjusting your filters'
              : 'Create your first vehicle to get started'}
          </p>
          {canCreate && !filters.title && !filters.deliveryType && (
            <Button
              variant="primary"
              onClick={handleCreateVehicle}
              className="mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Vehicle
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => handleViewVehicle(vehicle)}
              className="cursor-pointer"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getDeliveryTypeIcon(vehicle.delivery_type)}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {vehicle.title}
                      </h3>
                      <Badge variant={getDeliveryTypeBadgeColor(vehicle.delivery_type)}>
                        {getDeliveryTypeLabel(vehicle.delivery_type)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {vehicle.cargo_id ? (
                        <span className="text-blue-600 dark:text-blue-400">
                          ● Assigned to cargo
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          ○ Available
                        </span>
                      )}
                    </div>
                  </div>

                  {canDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteVehicle(vehicle.id);
                      }}
                      isLoading={deletingId === vehicle.id}
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
      {!isLoading && filteredVehicles.length > 0 && (
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

import React from 'react';
import { Truck, Ship, Plane, Package } from 'lucide-react';
import { Badge, Spinner } from '../../ui';
import { DELIVERY_TYPE } from '../../../constants';
import type { Vehicle } from '../../../types';

interface VehicleDetailsProps {
  vehicle: Vehicle | null;
  isLoading: boolean;
}

export const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Vehicle not found</p>
      </div>
    );
  }

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

  const getDeliveryTypeLabel = (type: string) => {
    switch (type) {
      case DELIVERY_TYPE.LAND:
        return 'Land Transport';
      case DELIVERY_TYPE.WATER:
        return 'Water Transport';
      case DELIVERY_TYPE.AIR:
        return 'Air Transport';
      default:
        return type;
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

  return (
    <div className="space-y-6">
      {/* Title and Type */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          {getDeliveryTypeIcon(vehicle.delivery_type)}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {vehicle.title}
          </h3>
          <Badge variant={getDeliveryTypeBadgeColor(vehicle.delivery_type)}>
            {getDeliveryTypeLabel(vehicle.delivery_type)}
          </Badge>
        </div>
      </div>

      {/* Delivery Type Details */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          {getDeliveryTypeIcon(vehicle.delivery_type)}
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Transport Type</h4>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {vehicle.delivery_type === DELIVERY_TYPE.LAND && 'Ground transportation including trucks, vans, and other road vehicles.'}
          {vehicle.delivery_type === DELIVERY_TYPE.WATER && 'Maritime transportation including ships, boats, and other watercraft.'}
          {vehicle.delivery_type === DELIVERY_TYPE.AIR && 'Air transportation including planes, helicopters, and other aircraft.'}
        </p>
      </div>

      {/* Current Cargo */}
      {vehicle.cargo_id ? (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Currently Assigned</h4>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            This vehicle is currently assigned to a cargo.
          </p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-mono">
            Cargo ID: {vehicle.cargo_id}
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-gray-500" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Cargo Status</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No cargo currently assigned to this vehicle.
          </p>
        </div>
      )}

      {/* IDs */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Vehicle ID:</span>
          <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
            {vehicle.id.substring(0, 8)}...
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Company ID:</span>
          <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
            {vehicle.company_id.substring(0, 8)}...
          </span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Clock, Package } from 'lucide-react';
import { Badge, Spinner } from '../../ui';
import { formatDate } from '../../../utils/formatters';
import { CARGO_STATUS } from '../../../constants';
import type { Cargo } from '../../../types';

interface CargoDetailsProps {
  cargo: Cargo | null;
  isLoading: boolean;
}

export const CargoDetails: React.FC<CargoDetailsProps> = ({ cargo, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cargo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Cargo not found</p>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Title and Status */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {cargo.title}
          </h3>
          <Badge variant={getStatusColor(cargo.status)}>
            {cargo.status}
          </Badge>
        </div>
        {cargo.description && (
          <p className="text-gray-600 dark:text-gray-400">
            {cargo.description}
          </p>
        )}
      </div>

      {/* Cargo Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-5 h-5 text-gray-500" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Cargo Information</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <Badge variant={getStatusColor(cargo.status)} size="sm">
              {cargo.status}
            </Badge>
          </div>
          {cargo.vehicle_id && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Vehicle ID:</span>
              <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
                {cargo.vehicle_id.substring(0, 8)}...
              </span>
            </div>
          )}
          {cargo.order_id && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Order ID:</span>
              <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
                {cargo.order_id.substring(0, 8)}...
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Supply Node Connection:</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
              {cargo.supply_node_connection_id.substring(0, 8)}...
            </span>
          </div>
        </div>
      </div>

      {/* Timestamps */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-gray-500" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Timeline</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Created:</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formatDate(cargo.created_at)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
            <span className="text-gray-900 dark:text-gray-100">
              {formatDate(cargo.updated_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

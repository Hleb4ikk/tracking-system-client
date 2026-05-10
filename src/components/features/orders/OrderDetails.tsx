import React from 'react';
import { Clock, MapPin, Package, ExternalLink } from 'lucide-react';
import { Badge, Spinner, Button } from '../../ui';
import { formatDate } from '../../../utils/formatters';
import type { OrderWithDetails } from '../../../types';

interface OrderDetailsProps {
  order: OrderWithDetails | null;
  isLoading: boolean;
  onViewAllCargos?: (orderId: string) => void;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ order, isLoading, onViewAllCargos }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Order not found</p>
      </div>
    );
  }

  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('completed') || statusLower.includes('delivered')) return 'success';
    if (statusLower.includes('progress') || statusLower.includes('processing')) return 'primary';
    if (statusLower.includes('pending') || statusLower.includes('waiting')) return 'warning';
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return 'danger';
    return 'default';
  };

  return (
    <div className="space-y-6">
      {/* Title and Status */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {order.title}
          </h3>
          <Badge variant={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>
        {order.description && (
          <p className="text-gray-600 dark:text-gray-400">
            {order.description}
          </p>
        )}
      </div>

      {/* Receiver Info */}
      {order.reciever && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Receiver</h4>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Name:</span> {order.reciever.name} {order.reciever.surname}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Email:</span> {order.reciever.email}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-medium">Phone:</span> {order.reciever.phone}
            </p>
          </div>
        </div>
      )}

      {/* Cargos */}
      {order.cargos && order.cargos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-500" />
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Cargos ({order.cargos.length})
              </h4>
            </div>
            {onViewAllCargos && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onViewAllCargos(order.id)}
                className="flex items-center gap-1"
              >
                View All
                <ExternalLink className="w-3 h-3" />
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {order.cargos.map((cargo) => (
              <div
                key={cargo.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {cargo.title}
                  </span>
                  <Badge variant={getStatusColor(cargo.status)} size="sm">
                    {cargo.status}
                  </Badge>
                </div>
                {cargo.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {cargo.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status History */}
      {order.status_history && order.status_history.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Status History</h4>
          </div>
          <div className="space-y-2">
            {order.status_history.map((history) => (
              <div
                key={history.id}
                className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
              >
                <span className="text-gray-900 dark:text-gray-100">{history.title}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {formatDate(history.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

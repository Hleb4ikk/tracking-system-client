import React from 'react';
import { MapPin, Building } from 'lucide-react';
import { Spinner } from '../../ui';
import type { SupplyNode } from '../../../types';

interface SupplyNodeDetailsProps {
  supplyNode: SupplyNode | null;
  isLoading: boolean;
}

export const SupplyNodeDetails: React.FC<SupplyNodeDetailsProps> = ({ supplyNode, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!supplyNode) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Supply node not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {supplyNode.title}
        </h3>
        {supplyNode.description && (
          <p className="text-gray-600 dark:text-gray-400">
            {supplyNode.description}
          </p>
        )}
      </div>

      {/* Location Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-gray-500" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Location</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Address:</span>
            <span className="text-gray-900 dark:text-gray-100 text-right">
              {supplyNode.address_line}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">City:</span>
            <span className="text-gray-900 dark:text-gray-100">{supplyNode.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Region:</span>
            <span className="text-gray-900 dark:text-gray-100">{supplyNode.region}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">ZIP Code:</span>
            <span className="text-gray-900 dark:text-gray-100">{supplyNode.zip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Country:</span>
            <span className="text-gray-900 dark:text-gray-100">{supplyNode.country}</span>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Building className="w-5 h-5 text-gray-500" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Company</h4>
        </div>
        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Company ID:</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
              {supplyNode.company_id.substring(0, 8)}...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

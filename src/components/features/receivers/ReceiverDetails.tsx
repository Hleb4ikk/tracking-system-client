import React from 'react';
import { User, Mail, Phone } from 'lucide-react';
import { Spinner } from '../../ui';
import type { Receiver } from '../../../types';

interface ReceiverDetailsProps {
  receiver: Receiver | null;
  isLoading: boolean;
}

export const ReceiverDetails: React.FC<ReceiverDetailsProps> = ({ receiver, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!receiver) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Receiver not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {receiver.name} {receiver.surname}
          </h3>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Contact Information</h4>
        
        {/* Email */}
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
            <a
              href={`mailto:${receiver.email}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {receiver.email}
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
            <a
              href={`tel:${receiver.phone}`}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {receiver.phone}
            </a>
          </div>
        </div>
      </div>

      {/* IDs */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Receiver ID:</span>
          <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
            {receiver.id.substring(0, 8)}...
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Company ID:</span>
          <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
            {receiver.company_id.substring(0, 8)}...
          </span>
        </div>
      </div>
    </div>
  );
};

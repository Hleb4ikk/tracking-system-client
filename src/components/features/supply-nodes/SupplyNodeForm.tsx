import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '../../ui';
import { useToast } from '../../../hooks';
import { supplyNodesApi } from '../../../api';
import { createSupplyNodeSchema, updateSupplyNodeSchema, type CreateSupplyNodeFormData, type UpdateSupplyNodeFormData } from '../../../schemas';
import { useUIStore } from '../../../stores';
import type { SupplyNode } from '../../../types';

interface SupplyNodeFormProps {
  supplyNode?: SupplyNode | null;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

export const SupplyNodeForm: React.FC<SupplyNodeFormProps> = ({ supplyNode, mode, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { closeDrawer } = useUIStore();

  const isEditMode = mode === 'edit';
  const schema = isEditMode ? updateSupplyNodeSchema : createSupplyNodeSchema;

  const form = useForm<CreateSupplyNodeFormData | UpdateSupplyNodeFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEditMode && supplyNode ? {
      title: supplyNode.title,
      description: supplyNode.description || '',
      country: supplyNode.country,
      zip: supplyNode.zip,
      region: supplyNode.region,
      city: supplyNode.city,
      address_line: supplyNode.address_line,  // snake_case → snake_case
    } : {
      title: '',
      description: '',
      country: '',
      zip: '',
      region: '',
      city: '',
      address_line: '',  // snake_case to match backend
    },
  });

  const onSubmit = async (data: CreateSupplyNodeFormData | UpdateSupplyNodeFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && supplyNode) {
        const response = await supplyNodesApi.updateSupplyNode(supplyNode.id, data as UpdateSupplyNodeFormData);
        toast.success(response.message);
      } else {
        const response = await supplyNodesApi.createSupplyNode(data as CreateSupplyNodeFormData);
        toast.success(response.message);
      }
      closeDrawer();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} supply node`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title *
        </label>
        <Input
          id="title"
          type="text"
          placeholder="e.g., Main Warehouse NYC"
          {...form.register('title')}
          error={form.formState.errors.title?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Enter supply node description"
          {...form.register('description')}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {/* Address Line */}
      <div>
        <label htmlFor="address_line" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Address *
        </label>
        <Input
          id="address_line"
          type="text"
          placeholder="e.g., 123 Broadway"
          {...form.register('address_line')}
          error={form.formState.errors.address_line?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* City and Region */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City *
          </label>
          <Input
            id="city"
            type="text"
            placeholder="e.g., New York"
            {...form.register('city')}
            error={form.formState.errors.city?.message}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Region/State *
          </label>
          <Input
            id="region"
            type="text"
            placeholder="e.g., New York"
            {...form.register('region')}
            error={form.formState.errors.region?.message}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Country and ZIP */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Country *
          </label>
          <Input
            id="country"
            type="text"
            placeholder="e.g., United States"
            {...form.register('country')}
            error={form.formState.errors.country?.message}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ZIP Code *
          </label>
          <Input
            id="zip"
            type="text"
            placeholder="e.g., 10001"
            {...form.register('zip')}
            error={form.formState.errors.zip?.message}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={closeDrawer}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex-1"
        >
          {isEditMode ? 'Update Supply Node' : 'Create Supply Node'}
        </Button>
      </div>
    </form>
  );
};

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '../../ui';
import { useToast } from '../../../hooks';
import { vehiclesApi } from '../../../api';
import { createVehicleSchema, updateVehicleSchema, type CreateVehicleFormData, type UpdateVehicleFormData } from '../../../schemas';
import { useUIStore } from '../../../stores';
import { DELIVERY_TYPE } from '../../../constants';
import type { Vehicle } from '../../../types';

interface VehicleFormProps {
  vehicle?: Vehicle | null;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ vehicle, mode, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { closeDrawer } = useUIStore();
  const isEditMode = mode === 'edit';
  const schema = isEditMode ? updateVehicleSchema : createVehicleSchema;

  const form = useForm<CreateVehicleFormData | UpdateVehicleFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEditMode && vehicle ? {
      title: vehicle.title,
      deliveryType: vehicle.delivery_type,
    } : {
      title: '',
      deliveryType: DELIVERY_TYPE.LAND,
    },
  });

  const onSubmit = async (data: CreateVehicleFormData | UpdateVehicleFormData) => {
    setIsSubmitting(true);
    
    try {
      if (isEditMode && vehicle) {
        const response = await vehiclesApi.updateVehicle(vehicle.id, data as UpdateVehicleFormData);
        toast.success(response.message);
      } else {
        const response = await vehiclesApi.createVehicle(data as CreateVehicleFormData);
        toast.success(response.message);
      }
      closeDrawer();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} vehicle`);
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
          placeholder="Enter vehicle title"
          {...form.register('title')}
          error={form.formState.errors.title?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Delivery Type */}
      <div>
        <label htmlFor="deliveryType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Delivery Type *
        </label>
        <select
          id="deliveryType"
          {...form.register('deliveryType')}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value={DELIVERY_TYPE.LAND}>🚚 Land (Truck, Van)</option>
          <option value={DELIVERY_TYPE.WATER}>🚢 Water (Ship, Boat)</option>
          <option value={DELIVERY_TYPE.AIR}>✈️ Air (Plane, Helicopter)</option>
        </select>
        {form.formState.errors.deliveryType && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.deliveryType.message}
          </p>
        )}
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
          {isEditMode ? 'Update Vehicle' : 'Create Vehicle'}
        </Button>
      </div>
    </form>
  );
};

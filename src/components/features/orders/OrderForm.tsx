import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Spinner } from '../../ui';
import { useToast } from '../../../hooks';
import { ordersApi, receiversApi } from '../../../api';
import { createOrderSchema, updateOrderSchema, type CreateOrderFormData, type UpdateOrderFormData } from '../../../schemas';
import { useAuthStore, useUIStore } from '../../../stores';
import type { OrderWithDetails, Receiver } from '../../../types';

interface OrderFormProps {
  order?: OrderWithDetails | null;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({ order, mode, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [isLoadingReceivers, setIsLoadingReceivers] = useState(true);
  const toast = useToast();
  const { user } = useAuthStore();
  const { closeDrawer } = useUIStore();

  const isEditMode = mode === 'edit';
  const schema = isEditMode ? updateOrderSchema : createOrderSchema;

  const form = useForm<CreateOrderFormData | UpdateOrderFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEditMode && order ? {
      title: order.title,
      status: order.status,
      description: order.description || '',
      responsibleId: order.responsible_id,
      recieverId: order.reciever_id,
    } : {
      title: '',
      status: 'pending',
      description: '',
      responsibleId: user?.id || '',
      recieverId: '',
    },
  });

  // Load receivers
  useEffect(() => {
    const loadReceivers = async () => {
      try {
        const data = await receiversApi.getReceivers(1);
        setReceivers(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load receivers');
      } finally {
        setIsLoadingReceivers(false);
      }
    };
    loadReceivers();
  }, []);

  const onSubmit = async (data: CreateOrderFormData | UpdateOrderFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && order) {
        const response = await ordersApi.updateOrder(order.id, data as UpdateOrderFormData);
        toast.success(response.message);
      } else {
        const response = await ordersApi.createOrder(data as CreateOrderFormData);
        toast.success(response.message);
      }
      closeDrawer();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} order`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingReceivers) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

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
          placeholder="Enter order title"
          {...form.register('title')}
          error={form.formState.errors.title?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status *
        </label>
        <Input
          id="status"
          type="text"
          placeholder="e.g., pending, in progress, completed"
          {...form.register('status')}
          error={form.formState.errors.status?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Enter order description"
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

      {/* Responsible (hidden, uses current user) */}
      <input type="hidden" {...form.register('responsibleId')} />

      {/* Receiver */}
      <div>
        <label htmlFor="recieverId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Receiver *
        </label>
        <select
          id="recieverId"
          {...form.register('recieverId')}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select receiver</option>
          {receivers.map((receiver) => (
            <option key={receiver.id} value={receiver.id}>
              {receiver.name} {receiver.surname} - {receiver.email}
            </option>
          ))}
        </select>
        {form.formState.errors.recieverId && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.recieverId.message}
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
          {isEditMode ? 'Update Order' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
};

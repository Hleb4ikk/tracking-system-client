import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '../../ui';
import { useToast } from '../../../hooks';
import { receiversApi } from '../../../api';
import { createReceiverSchema, updateReceiverSchema, type CreateReceiverFormData, type UpdateReceiverFormData } from '../../../schemas';
import { useUIStore } from '../../../stores';
import type { Receiver } from '../../../types';

interface ReceiverFormProps {
  receiver?: Receiver | null;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

export const ReceiverForm: React.FC<ReceiverFormProps> = ({ receiver, mode, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const { closeDrawer } = useUIStore();
  const isEditMode = mode === 'edit';
  const schema = isEditMode ? updateReceiverSchema : createReceiverSchema;

  const form = useForm<CreateReceiverFormData | UpdateReceiverFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEditMode && receiver ? {
      name: receiver.name,
      surname: receiver.surname,
      email: receiver.email,
      phone: receiver.phone,
    } : {
      name: '',
      surname: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: CreateReceiverFormData | UpdateReceiverFormData) => {
    setIsSubmitting(true);
    
    try {
      if (isEditMode && receiver) {
        const response = await receiversApi.updateReceiver(receiver.id, data as UpdateReceiverFormData);
        toast.success(response.message);
      } else {
        const response = await receiversApi.createReceiver(data as CreateReceiverFormData);
        toast.success(response.message);
      }
      closeDrawer();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} receiver`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          First Name *
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Enter first name"
          {...form.register('name')}
          error={form.formState.errors.name?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Surname */}
      <div>
        <label htmlFor="surname" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Last Name *
        </label>
        <Input
          id="surname"
          type="text"
          placeholder="Enter last name"
          {...form.register('surname')}
          error={form.formState.errors.surname?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email *
        </label>
        <Input
          id="email"
          type="email"
          placeholder="receiver@example.com"
          {...form.register('email')}
          error={form.formState.errors.email?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone *
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="+1234567890"
          {...form.register('phone')}
          error={form.formState.errors.phone?.message}
          disabled={isSubmitting}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Format: +[country code][number] (E.164 format)
        </p>
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
          {isEditMode ? 'Update Receiver' : 'Create Receiver'}
        </Button>
      </div>
    </form>
  );
};

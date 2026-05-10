import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Save, Trash2, AlertTriangle } from 'lucide-react';
import { Button, Input, Card, Spinner } from '../../components/ui';
import { useToast } from '../../hooks';
import { companyApi } from '../../api';
import { updateCompanySchema, type UpdateCompanyFormData } from '../../schemas';
import { useAuthStore } from '../../stores';
import type { Company } from '../../types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const CompanySettingsPage: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const toast = useToast();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const isOwner = user?.role === 'co-founder';

  const form = useForm<UpdateCompanyFormData>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    setIsLoading(true);
    try {
      const { company: companyData } = await companyApi.getUserCompany();
      setCompany(companyData);
      form.reset({
        title: companyData.title,
        description: companyData.description || '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load company');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UpdateCompanyFormData) => {
    if (!isOwner) {
      toast.error('Only company owner can update company settings');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await companyApi.updateCompany(data);
      toast.success(response.message);
      fetchCompany();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!isOwner) {
      toast.error('Only company owner can delete the company');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await companyApi.deleteCompany();
      toast.success(response.message);
      // Logout user after company deletion
      logout();
      navigate(ROUTES.LOGIN);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete company');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Company not found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load company information
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Company Settings</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your company information and settings
        </p>
      </div>

      {/* Company Information */}
      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Company Information
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company Name *
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Enter company name"
              {...form.register('title')}
              error={form.formState.errors.title?.message}
              disabled={isSubmitting || !isOwner}
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
              placeholder="Enter company description"
              {...form.register('description')}
              disabled={isSubmitting || !isOwner}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            {form.formState.errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* Company ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Company ID
            </label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
              <code className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {company.id}
              </code>
            </div>
          </div>

          {/* Owner ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Owner ID
            </label>
            <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
              <code className="text-sm text-gray-900 dark:text-gray-100 font-mono">
                {company.owner_id}
              </code>
            </div>
          </div>

          {/* Save Button */}
          {isOwner && (
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                isLoading={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}

          {!isOwner && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Only the company owner can modify these settings.
              </p>
            </div>
          )}
        </form>
      </Card>

      {/* Danger Zone */}
      {isOwner && (
        <Card className="p-6 border-red-200 dark:border-red-800">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </h2>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Deleting your company will permanently remove all associated data including orders, cargos, vehicles, and team members. This action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <Button
                variant="danger"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Company
              </Button>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-4">
                  Are you absolutely sure? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={handleDeleteCompany}
                    isLoading={isDeleting}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Yes, Delete Company
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

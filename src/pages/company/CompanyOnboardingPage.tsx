import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Mail, ArrowRight } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useAuthStore } from '../../stores';
import { companyApi, invitationsApi, userApi } from '../../api';
import { useToast } from '../../hooks';
import {
  createCompanySchema,
  acceptInvitationSchema,
  type CreateCompanyFormData,
  type AcceptInvitationFormData,
} from '../../schemas';
import { ROUTES } from '../../constants';

type OnboardingMode = 'select' | 'create' | 'join';

export const CompanyOnboardingPage: React.FC = () => {
  const [mode, setMode] = useState<OnboardingMode>('select');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { success, error: toastError } = useToast();

  useEffect(() => {
    if (user?.company_id) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const createForm = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      title: '',
      description: null,
    },
  });

  const joinForm = useForm<AcceptInvitationFormData>({
    resolver: zodResolver(acceptInvitationSchema),
    defaultValues: {
      invitationId: '',
    },
  });

  const handleCreateCompany = async (data: CreateCompanyFormData) => {
    setIsLoading(true);
    try {
      // Convert empty string to null for description
      const payload = {
        title: data.title,
        description: data.description?.trim() || null,
      };
      await companyApi.createCompany(payload);
      
      // Refresh user data to get updated company_id
      const userResponse = await userApi.getCurrentUser();
      setUser(userResponse.user);
      
      success('Company created successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      toastError(error.message || 'Failed to create company');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (data: AcceptInvitationFormData) => {
    setIsLoading(true);
    try {
      await invitationsApi.acceptInvitation(data.invitationId);
      
      // Refresh user data to get updated company_id
      const userResponse = await userApi.getCurrentUser();
      setUser(userResponse.user);
      
      success('Invitation accepted successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      toastError(error.message || 'Failed to accept invitation');
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to Tracking System
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              To get started, you need to create a company or join an existing one
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Company Card */}
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-blue-500 bg-white">
              <div
                onClick={() => setMode('create')}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 dark:text-gray-100">
                  Create Company
                </h2>
                <p className="text-gray-600 mb-6">
                  Start your own company and invite team members to join
                </p>
                <Button variant="secondary" className="w-full">
                  Create New Company
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Join Company Card */}
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-purple-500 bg-white">
              <div
                onClick={() => setMode('join')}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2 dark:text-gray-100">
                  Join with Invitation
                </h2>
                <p className="text-gray-600 mb-6">
                  Have an invitation code? Join an existing company
                </p>
                <Button variant="secondary" className="w-full">
                  Accept Invitation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Create Your Company
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Fill in the details to create your company
            </p>
          </div>

          <form onSubmit={createForm.handleSubmit(handleCreateCompany)} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Company Name *
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Enter company name"
                {...createForm.register('title')}
                error={createForm.formState.errors.title?.message}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Enter company description"
                {...createForm.register('description')}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              {createForm.formState.errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {createForm.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setMode('select')}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex-1"
              >
                Create Company
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Join a Company
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the invitation ID you received
            </p>
          </div>

          <form onSubmit={joinForm.handleSubmit(handleAcceptInvitation)} className="space-y-4">
            <div>
              <label htmlFor="invitationId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invitation ID *
              </label>
              <Input
                id="invitationId"
                type="text"
                placeholder="Enter invitation ID (UUID)"
                {...joinForm.register('invitationId')}
                error={joinForm.formState.errors.invitationId?.message}
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                The invitation ID should be a UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setMode('select')}
                disabled={isLoading}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="flex-1"
              >
                Accept Invitation
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return null;
};

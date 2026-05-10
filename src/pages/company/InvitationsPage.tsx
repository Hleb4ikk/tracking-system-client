import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';
import { Mail, Trash2, Plus, Copy, Check, Filter, X } from 'lucide-react';
import { Button, Input, Card, Badge, Modal, Spinner, Pagination } from '../../components/ui';
import { useToast } from '../../hooks';
import { invitationsApi, type Invitation } from '../../api/invitations.api';
import { createInvitationSchema, type CreateInvitationFormData } from '../../schemas';
import { ROLE_LABELS, PAGINATION } from '../../constants';
import { useAuthStore } from '../../stores';

export const InvitationsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Get initial values from URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const emailFromUrl = searchParams.get('email') || '';
  const roleFromUrl = searchParams.get('role') || '';
  
  // Pagination & Filters
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    email: emailFromUrl,
    role: roleFromUrl,
  });
  
  const toast = useToast();
  const { user } = useAuthStore();

  const createForm = useForm<CreateInvitationFormData>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      recieverEmail: '',
      role: 'expeditor',
      daysToDelete: 7,
    },
  });

  const canManageInvitations = user?.role === 'co-founder' || user?.role === 'logistician';

  // Update URL when page or filters change
  const updateSearchParams = (page: number, newFilters?: typeof filters) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    
    const activeFilters = newFilters || filters;
    if (activeFilters.email) params.set('email', activeFilters.email);
    if (activeFilters.role) params.set('role', activeFilters.role);
    
    setSearchParams(params);
  };

  const fetchInvitations = async (page: number = currentPage, activeFilters = filters) => {
    setIsLoading(true);
    try {
      const query: any = { page };
      if (activeFilters.email) query.email = activeFilters.email;
      if (activeFilters.role) query.role = activeFilters.role;
      
      const data = await invitationsApi.getInvitations(query);
      setInvitations(data);
      
      // Calculate total pages (backend returns 20 items per page)
      // If we get less than 20 items, we're on the last page
      if (data.length < PAGINATION.DEFAULT_LIMIT) {
        setTotalPages(page);
      } else {
        // Assume there might be more pages
        setTotalPages(page + 1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (canManageInvitations) {
      // Load data based on URL params on mount
      fetchInvitations(pageFromUrl, { email: emailFromUrl, role: roleFromUrl });
    }
  }, [canManageInvitations]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(page);
    fetchInvitations(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    updateSearchParams(1, filters);
    fetchInvitations(1, filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { email: '', role: '' };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateSearchParams(1, clearedFilters);
    fetchInvitations(1, clearedFilters);
    setShowFilters(false);
  };

  const handleCreateInvitation = async (data: CreateInvitationFormData) => {
    setIsCreating(true);
    try {
      const response = await invitationsApi.createInvitation(data);
      toast.success(response.message);
      setIsCreateModalOpen(false);
      createForm.reset();
      fetchInvitations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create invitation');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteInvitation = async (invitationId: string) => {
    if (!confirm('Are you sure you want to delete this invitation?')) {
      return;
    }

    setDeletingId(invitationId);
    try {
      const response = await invitationsApi.deleteInvitation(invitationId);
      toast.success(response.message);
      fetchInvitations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete invitation');
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyInvitationId = async (invitationId: string) => {
    try {
      await navigator.clipboard.writeText(invitationId);
      setCopiedId(invitationId);
      toast.success('Invitation ID copied to clipboard');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy invitation ID');
    }
  };

  if (!canManageInvitations) {
    return (
      <div className="p-6">
        <Card className="p-8 text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Only Co-Founders and Logisticians can manage invitations.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Team Invitations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Invite new members to join your company
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {(filters.email || filters.role) && (
              <Badge variant="primary" size="sm">
                Active
              </Badge>
            )}
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Invitation
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="email"
                placeholder="Filter by email"
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">All Roles</option>
                <option value="co-founder">Co-Founder</option>
                <option value="logistician">Logistician</option>
                <option value="expeditor">Expeditor</option>
                <option value="сourier">Courier</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleApplyFilters}>
                Apply
              </Button>
              <Button variant="secondary" onClick={handleClearFilters}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Invitations List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : invitations.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No invitations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first invitation to invite team members
          </p>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invitation
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {invitation.reciever_email}
                    </h3>
                    <Badge variant="primary">
                      {ROLE_LABELS[invitation.role as keyof typeof ROLE_LABELS] || invitation.role}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span>Expires in {invitation.days_to_delete} days</span>
                  </div>

                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <code className="text-sm text-gray-700 dark:text-gray-300 flex-1 font-mono">
                      {invitation.id}
                    </code>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleCopyInvitationId(invitation.id)}
                      className="flex items-center gap-1"
                    >
                      {copiedId === invitation.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy ID
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteInvitation(invitation.id)}
                  isLoading={deletingId === invitation.id}
                  className="ml-4"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && invitations.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {/* Create Invitation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          createForm.reset();
        }}
        title="Create Invitation"
      >
        <form onSubmit={createForm.handleSubmit(handleCreateInvitation)} className="space-y-4">
          <div>
            <label htmlFor="recieverEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
            </label>
            <Input
              id="recieverEmail"
              type="email"
              placeholder="colleague@example.com"
              {...createForm.register('recieverEmail')}
              error={createForm.formState.errors.recieverEmail?.message}
              disabled={isCreating}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role *
            </label>
            <select
              id="role"
              {...createForm.register('role')}
              disabled={isCreating}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="co-founder">Co-Founder</option>
              <option value="logistician">Logistician</option>
              <option value="expeditor">Expeditor</option>
              <option value="сourier">Courier</option>
            </select>
            {createForm.formState.errors.role && (
              <p className="mt-1 text-sm text-red-600">
                {createForm.formState.errors.role.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="daysToDelete" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expires in (days)
            </label>
            <Input
              id="daysToDelete"
              type="number"
              min="1"
              max="30"
              placeholder="7"
              {...createForm.register('daysToDelete', { valueAsNumber: true })}
              error={createForm.formState.errors.daysToDelete?.message}
              disabled={isCreating}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              The invitation will automatically expire after this many days
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                createForm.reset();
              }}
              disabled={isCreating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isCreating}
              className="flex-1"
            >
              Create Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

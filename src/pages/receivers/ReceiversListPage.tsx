import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Users, Plus, Filter, X, Trash2, Edit, Mail, Phone } from 'lucide-react';
import { Button, Input, Card, Spinner, Pagination } from '../../components/ui';
import { ReceiverDetails, ReceiverForm } from '../../components/features/receivers';
import { useToast } from '../../hooks';
import { receiversApi } from '../../api';
import { PAGINATION } from '../../constants';
import { useAuthStore, useUIStore } from '../../stores';
import type { Receiver } from '../../types';

export const ReceiversListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const { user } = useAuthStore();
  const { openDrawer } = useUIStore();

  // Get initial values from URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const nameFromUrl = searchParams.get('name') || '';
  const surnameFromUrl = searchParams.get('surname') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    name: nameFromUrl,
    surname: surnameFromUrl,
    email: emailFromUrl,
  });

  const canCreate = user?.role === 'co-founder' || user?.role === 'logistician';
  const canDelete = user?.role === 'co-founder' || user?.role === 'logistician';
  const canEdit = user?.role === 'co-founder' || user?.role === 'logistician';

  // Update URL when page or filters change
  const updateSearchParams = (page: number, newFilters?: typeof filters) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    
    const activeFilters = newFilters || filters;
    if (activeFilters.name) params.set('name', activeFilters.name);
    if (activeFilters.surname) params.set('surname', activeFilters.surname);
    if (activeFilters.email) params.set('email', activeFilters.email);
    
    setSearchParams(params);
  };

  const fetchReceivers = async (page: number = currentPage, activeFilters = filters) => {
    setIsLoading(true);
    try {
      const apiFilters: any = {};
      if (activeFilters.name) apiFilters.name = activeFilters.name;
      if (activeFilters.surname) apiFilters.surname = activeFilters.surname;
      if (activeFilters.email) apiFilters.email = activeFilters.email;
      
      const data = await receiversApi.getReceivers(page, apiFilters);
      setReceivers(data);
      
      // Calculate total pages
      if (data.length < PAGINATION.DEFAULT_LIMIT) {
        setTotalPages(page);
      } else {
        setTotalPages(page + 1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load receivers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivers(pageFromUrl, { name: nameFromUrl, surname: surnameFromUrl, email: emailFromUrl });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(page);
    fetchReceivers(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    updateSearchParams(1, filters);
    fetchReceivers(1, filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { name: '', surname: '', email: '' };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateSearchParams(1, clearedFilters);
    fetchReceivers(1, clearedFilters);
    setShowFilters(false);
  };

  const handleDeleteReceiver = async (receiverId: string) => {
    if (!confirm('Are you sure you want to delete this receiver?')) {
      return;
    }

    setDeletingId(receiverId);
    try {
      const response = await receiversApi.deleteReceiver(receiverId);
      toast.success(response.message);
      fetchReceivers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete receiver');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewReceiver = (receiver: Receiver) => {
    openDrawer({
      title: 'Receiver Details',
      size: 'lg',
      content: (
        <div>
          <ReceiverDetails receiver={receiver} isLoading={false} />
          {canEdit && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="primary"
                onClick={() => handleEditReceiver(receiver)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Receiver
              </Button>
            </div>
          )}
        </div>
      ),
    });
  };

  const handleCreateReceiver = () => {
    openDrawer({
      title: 'Create Receiver',
      size: 'lg',
      content: <ReceiverForm mode="create" onSuccess={() => fetchReceivers()} />,
    });
  };

  const handleEditReceiver = (receiver: Receiver) => {
    openDrawer({
      title: 'Edit Receiver',
      size: 'lg',
      content: <ReceiverForm mode="edit" receiver={receiver} onSuccess={() => fetchReceivers()} />,
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Receivers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your delivery receivers
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
          </Button>
          {canCreate && (
            <Button
              variant="primary"
              onClick={handleCreateReceiver}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Receiver
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <Input
                type="text"
                placeholder="Search by first name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <Input
                type="text"
                placeholder="Search by last name"
                value={filters.surname}
                onChange={(e) => setFilters({ ...filters, surname: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <Input
                type="text"
                placeholder="Search by email"
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleApplyFilters}>
              Apply Filters
            </Button>
            <Button variant="secondary" onClick={handleClearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </Card>
      )}

      {/* Receivers List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : receivers.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No receivers found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.name || filters.surname || filters.email
              ? 'Try adjusting your filters'
              : 'Create your first receiver to get started'}
          </p>
          {canCreate && !filters.name && !filters.surname && !filters.email && (
            <Button
              variant="primary"
              onClick={handleCreateReceiver}
              className="mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Receiver
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {receivers.map((receiver) => (
            <div
              key={receiver.id}
              onClick={() => handleViewReceiver(receiver)}
              className="cursor-pointer"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {receiver.name} {receiver.surname}
                      </h3>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Mail className="w-4 h-4" />
                        <span>{receiver.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4" />
                        <span>{receiver.phone}</span>
                      </div>
                    </div>
                  </div>

                  {canDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReceiver(receiver.id);
                      }}
                      isLoading={deletingId === receiver.id}
                      className="ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && receivers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

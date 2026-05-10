import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Network, Plus, Filter, X, Trash2, Edit, Eye } from 'lucide-react';
import { Button, Input, Card, Spinner, Pagination } from '../../components/ui';
import {
  SupplyChainDetails,
  SupplyChainForm,
} from '../../components/features/supply-chains';
import { useToast } from '../../hooks';
import { supplyChainsApi } from '../../api';
import { PAGINATION, ROUTES } from '../../constants';
import { useAuthStore, useUIStore } from '../../stores';
import type { SupplyChain, SupplyChainWithGraph } from '../../types/supply-chain.types';

export const SupplyChainsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuthStore();
  const { openDrawer } = useUIStore();

  // Get initial values from URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const titleFromUrl = searchParams.get('title') || '';

  const [supplyChains, setSupplyChains] = useState<SupplyChain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    title: titleFromUrl,
  });

  const canCreate = user?.role === 'co-founder' || user?.role === 'logistician';
  const canDelete = user?.role === 'co-founder' || user?.role === 'logistician';
  const canEdit = user?.role === 'co-founder' || user?.role === 'logistician';

  // Update URL when page or filters change
  const updateSearchParams = (page: number, newFilters?: typeof filters) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());

    const activeFilters = newFilters || filters;
    if (activeFilters.title) params.set('title', activeFilters.title);

    setSearchParams(params);
  };

  const fetchSupplyChains = async (
    page: number = currentPage,
    activeFilters = filters
  ) => {
    setIsLoading(true);
    try {
      const apiFilters: any = {};
      if (activeFilters.title) apiFilters.title = activeFilters.title;

      const data = await supplyChainsApi.getSupplyChains(page, apiFilters);
      setSupplyChains(data);

      // Calculate total pages
      if (data.length < PAGINATION.DEFAULT_LIMIT) {
        setTotalPages(page);
      } else {
        setTotalPages(page + 1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load supply chains');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplyChains(pageFromUrl, { title: titleFromUrl });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(page);
    fetchSupplyChains(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    updateSearchParams(1, filters);
    fetchSupplyChains(1, filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { title: '' };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateSearchParams(1, clearedFilters);
    fetchSupplyChains(1, clearedFilters);
    setShowFilters(false);
  };

  const handleDeleteSupplyChain = async (supplyChainId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this supply chain? This action cannot be undone.'
      )
    ) {
      return;
    }

    setDeletingId(supplyChainId);
    try {
      const response = await supplyChainsApi.deleteSupplyChain(supplyChainId);
      toast.success(response.message);
      fetchSupplyChains();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete supply chain');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewSupplyChain = async (supplyChain: SupplyChain) => {
    try {
      // Fetch full details with graph
      const fullChain = await supplyChainsApi.getSupplyChainById(supplyChain.id);

      // Capture navigate in closure
      const handleConnectionClick = (connectionId: string) => {
        navigate(`${ROUTES.CARGOS}?supplyNodeConnectionId=${connectionId}`);
      };

      openDrawer({
        title: 'Supply Chain Details',
        size: 'lg',
        content: (
          <div>
            <SupplyChainDetails 
              supplyChain={fullChain} 
              isLoading={false}
              onConnectionClick={handleConnectionClick}
            />
            {canEdit && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleEditSupplyChain(fullChain)}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Supply Chain
                </Button>
              </div>
            )}
          </div>
        ),
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load supply chain details');
    }
  };

  const handleCreateSupplyChain = () => {
    openDrawer({
      title: 'Create Supply Chain',
      size: 'lg',
      content: (
        <SupplyChainForm mode="create" onSuccess={() => fetchSupplyChains()} />
      ),
    });
  };

  const handleEditSupplyChain = (supplyChain: SupplyChain | SupplyChainWithGraph) => {
    openDrawer({
      title: 'Edit Supply Chain',
      size: 'lg',
      content: (
        <SupplyChainForm
          mode="edit"
          supplyChain={supplyChain}
          onSuccess={() => fetchSupplyChains()}
        />
      ),
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Supply Chains
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your supply chain networks and connections
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
              onClick={handleCreateSupplyChain}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Supply Chain
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title
              </label>
              <Input
                type="text"
                placeholder="Search by title"
                value={filters.title}
                onChange={(e) => setFilters({ ...filters, title: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
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

      {/* Supply Chains List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : supplyChains.length === 0 ? (
        <Card className="p-12 text-center">
          <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No supply chains found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.title
              ? 'Try adjusting your filters'
              : 'Create your first supply chain to get started'}
          </p>
          {canCreate && !filters.title && (
            <Button
              variant="primary"
              onClick={handleCreateSupplyChain}
              className="mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Supply Chain
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {supplyChains.map((chain) => (
            <div
              key={chain.id}
              onClick={() => handleViewSupplyChain(chain)}
              className="cursor-pointer"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Network className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {chain.title}
                      </h3>
                    </div>

                    {chain.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {chain.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Chain ID:</span>{' '}
                        <span className="font-mono text-xs">
                          {chain.id?.substring(0, 8) || 'N/A'}...
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewSupplyChain(chain);
                      }}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    {canDelete && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSupplyChain(chain.id);
                        }}
                        isLoading={deletingId === chain.id}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && supplyChains.length > 0 && (
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

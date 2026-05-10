import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPin, Plus, Filter, X, Trash2, Edit } from 'lucide-react';
import { Button, Input, Card, Spinner, Pagination } from '../../components/ui';
import { SupplyNodeDetails, SupplyNodeForm } from '../../components/features/supply-nodes';
import { useToast } from '../../hooks';
import { supplyNodesApi } from '../../api';
import { PAGINATION } from '../../constants';
import { useAuthStore, useUIStore } from '../../stores';
import type { SupplyNode } from '../../types';

export const SupplyNodesListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const toast = useToast();
  const { user } = useAuthStore();
  const { openDrawer } = useUIStore();

  // Get initial values from URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const titleFromUrl = searchParams.get('title') || '';
  const countryFromUrl = searchParams.get('country') || '';
  const cityFromUrl = searchParams.get('city') || '';

  const [supplyNodes, setSupplyNodes] = useState<SupplyNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    title: titleFromUrl,
    country: countryFromUrl,
    city: cityFromUrl,
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
    if (activeFilters.country) params.set('country', activeFilters.country);
    if (activeFilters.city) params.set('city', activeFilters.city);
    
    setSearchParams(params);
  };

  const fetchSupplyNodes = async (page: number = currentPage, activeFilters = filters) => {
    setIsLoading(true);
    try {
      const apiFilters: any = {};
      if (activeFilters.country) apiFilters.country = activeFilters.country;
      if (activeFilters.city) apiFilters.city = activeFilters.city;
      
      const data = await supplyNodesApi.getSupplyNodes(page, apiFilters);
      setSupplyNodes(data);
      
      // Calculate total pages
      if (data.length < PAGINATION.DEFAULT_LIMIT) {
        setTotalPages(page);
      } else {
        setTotalPages(page + 1);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load supply nodes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplyNodes(pageFromUrl, { title: titleFromUrl, country: countryFromUrl, city: cityFromUrl });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateSearchParams(page);
    fetchSupplyNodes(page);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    updateSearchParams(1, filters);
    fetchSupplyNodes(1, filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = { title: '', country: '', city: '' };
    setFilters(clearedFilters);
    setCurrentPage(1);
    updateSearchParams(1, clearedFilters);
    fetchSupplyNodes(1, clearedFilters);
    setShowFilters(false);
  };

  const handleDeleteSupplyNode = async (supplyNodeId: string) => {
    if (!confirm('Are you sure you want to delete this supply node?')) {
      return;
    }

    setDeletingId(supplyNodeId);
    try {
      const response = await supplyNodesApi.deleteSupplyNode(supplyNodeId);
      toast.success(response.message);
      fetchSupplyNodes();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete supply node');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewSupplyNode = (supplyNode: SupplyNode) => {
    openDrawer({
      title: 'Supply Node Details',
      size: 'lg',
      content: (
        <div>
          <SupplyNodeDetails supplyNode={supplyNode} isLoading={false} />
          {canEdit && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="primary"
                onClick={() => handleEditSupplyNode(supplyNode)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Supply Node
              </Button>
            </div>
          )}
        </div>
      ),
    });
  };

  const handleCreateSupplyNode = () => {
    openDrawer({
      title: 'Create Supply Node',
      size: 'lg',
      content: <SupplyNodeForm mode="create" onSuccess={() => fetchSupplyNodes()} />,
    });
  };

  const handleEditSupplyNode = (supplyNode: SupplyNode) => {
    openDrawer({
      title: 'Edit Supply Node',
      size: 'lg',
      content: <SupplyNodeForm mode="edit" supplyNode={supplyNode} onSuccess={() => fetchSupplyNodes()} />,
    });
  };


  // Client-side filtering by title
  const filteredSupplyNodes = supplyNodes.filter((node) => {
    if (filters.title && !node.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Supply Nodes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your supply chain nodes and warehouses
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
              onClick={handleCreateSupplyNode}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Supply Node
            </Button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <Input
                type="text"
                placeholder="Filter by country"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                City
              </label>
              <Input
                type="text"
                placeholder="Filter by city"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
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

      {/* Supply Nodes List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      ) : filteredSupplyNodes.length === 0 ? (
        <Card className="p-12 text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No supply nodes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {filters.title || filters.country || filters.city
              ? 'Try adjusting your filters'
              : 'Create your first supply node to get started'}
          </p>
          {canCreate && !filters.title && !filters.country && !filters.city && (
            <Button
              variant="primary"
              onClick={handleCreateSupplyNode}
              className="mx-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Supply Node
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredSupplyNodes.map((node) => (
            <div
              key={node.id}
              onClick={() => handleViewSupplyNode(node)}
              className="cursor-pointer"
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {node.title}
                      </h3>
                    </div>

                    {node.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {node.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div>
                        <span className="font-medium">Address:</span> {node.address_line}
                      </div>
                      <div>
                        <span className="font-medium">City:</span> {node.city}, {node.region}
                      </div>
                      <div>
                        <span className="font-medium">Country:</span> {node.country}
                      </div>
                      <div>
                        <span className="font-medium">ZIP:</span> {node.zip}
                      </div>
                    </div>
                  </div>

                  {canDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSupplyNode(node.id);
                      }}
                      isLoading={deletingId === node.id}
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
      {!isLoading && filteredSupplyNodes.length > 0 && (
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

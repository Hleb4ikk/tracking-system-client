import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { Button, Input, Spinner } from '../../ui';
import { useToast } from '../../../hooks';
import { supplyChainsApi, supplyNodesApi } from '../../../api';
import {
  createSupplyChainSchema,
  updateSupplyChainSchema,
  type CreateSupplyChainFormData,
  type UpdateSupplyChainFormData,
} from '../../../schemas';
import { useUIStore } from '../../../stores';
import type { SupplyChain, SupplyChainWithGraph } from '../../../types/supply-chain.types';
import type { SupplyNode } from '../../../types';

interface SupplyChainFormProps {
  supplyChain?: SupplyChain | SupplyChainWithGraph | null;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

export const SupplyChainForm: React.FC<SupplyChainFormProps> = ({
  supplyChain,
  mode,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supplyNodes, setSupplyNodes] = useState<SupplyNode[]>([]);
  const [isLoadingNodes, setIsLoadingNodes] = useState(true);
  const toast = useToast();
  const { closeDrawer } = useUIStore();

  const isEditMode = mode === 'edit';
  const schema = isEditMode ? updateSupplyChainSchema : createSupplyChainSchema;

  // Extract connections from graph if editing
  const extractConnectionsFromGraph = (chain: SupplyChainWithGraph | null): any[] => {
    if (!chain || !('supplyGraph' in chain) || !chain.supplyGraph?.supplyNode) {
      return [];
    }

    const connections: any[] = [];
    const visited = new Set<string>();

    const traverse = (node: any) => {
      if (visited.has(node.id)) return;
      visited.add(node.id);

      if (node.next && Array.isArray(node.next)) {
        node.next.forEach((edge: any) => {
          connections.push({
            startNodeId: node.id,
            destinationNodeId: edge.node.id,
            distance: edge.distance,
          });
          traverse(edge.node);
        });
      }
    };

    traverse(chain.supplyGraph.supplyNode);
    return connections;
  };

  const form = useForm<CreateSupplyChainFormData | UpdateSupplyChainFormData>({
    resolver: zodResolver(schema),
    defaultValues:
      isEditMode && supplyChain
        ? {
            title: supplyChain.title,
            description: supplyChain.description || '',
            supply_node_connections: extractConnectionsFromGraph(
              supplyChain as SupplyChainWithGraph
            ),
          }
        : {
            title: '',
            description: '',
            supply_node_connections: [],
          },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'supply_node_connections',
  });

  // Load supply nodes
  useEffect(() => {
    const loadSupplyNodes = async () => {
      setIsLoadingNodes(true);
      try {
        // Load multiple pages to get all nodes
        const allNodes: SupplyNode[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore && page <= 10) {
          // Limit to 10 pages max
          const nodes = await supplyNodesApi.getSupplyNodes(page);
          allNodes.push(...nodes);
          hasMore = nodes.length === 20; // Assuming 20 is the page size
          page++;
        }

        setSupplyNodes(allNodes);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load supply nodes');
      } finally {
        setIsLoadingNodes(false);
      }
    };

    loadSupplyNodes();
  }, []);

  const onSubmit = async (
    data: CreateSupplyChainFormData | UpdateSupplyChainFormData
  ) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && supplyChain) {
        const response = await supplyChainsApi.updateSupplyChain(
          supplyChain.id,
          data as UpdateSupplyChainFormData
        );
        toast.success(response.message);
      } else {
        const response = await supplyChainsApi.createSupplyChain(
          data as CreateSupplyChainFormData
        );
        toast.success(response.message);
      }
      closeDrawer();
      onSuccess?.();
    } catch (error: any) {
      toast.error(
        error.message || `Failed to ${isEditMode ? 'update' : 'create'} supply chain`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddConnection = () => {
    append({
      startNodeId: '',
      destinationNodeId: '',
      distance: 0,
    });
  };

  if (isLoadingNodes) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Basic Information
        </h3>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Title *
          </label>
          <Input
            id="title"
            type="text"
            placeholder="e.g., East Coast Distribution Chain"
            {...form.register('title')}
            error={form.formState.errors.title?.message}
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={3}
            placeholder="Enter supply chain description"
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
      </div>

      {/* Supply Node Connections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Supply Node Connections
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddConnection}
            disabled={isSubmitting || supplyNodes.length < 2}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Connection
          </Button>
        </div>

        {supplyNodes.length < 2 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              You need at least 2 supply nodes to create connections. Please create
              supply nodes first.
            </p>
          </div>
        )}

        {fields.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              No connections added yet
            </p>
            {supplyNodes.length >= 2 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleAddConnection}
                disabled={isSubmitting}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Connection
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Start Node */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        From Node *
                      </label>
                      <select
                        {...form.register(
                          `supply_node_connections.${index}.startNodeId`
                        )}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select start node</option>
                        {supplyNodes.map((node) => (
                          <option key={node.id} value={node.id}>
                            {node.title} ({node.city}, {node.country})
                          </option>
                        ))}
                      </select>
                      {form.formState.errors.supply_node_connections?.[index]
                        ?.startNodeId && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            form.formState.errors.supply_node_connections[index]
                              ?.startNodeId?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Destination Node */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        To Node *
                      </label>
                      <select
                        {...form.register(
                          `supply_node_connections.${index}.destinationNodeId`
                        )}
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Select destination node</option>
                        {supplyNodes.map((node) => (
                          <option key={node.id} value={node.id}>
                            {node.title} ({node.city}, {node.country})
                          </option>
                        ))}
                      </select>
                      {form.formState.errors.supply_node_connections?.[index]
                        ?.destinationNodeId && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            form.formState.errors.supply_node_connections[index]
                              ?.destinationNodeId?.message
                          }
                        </p>
                      )}
                    </div>

                    {/* Distance */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Distance (km) *
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="e.g., 150.5"
                        {...form.register(
                          `supply_node_connections.${index}.distance`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                        error={
                          form.formState.errors.supply_node_connections?.[index]
                            ?.distance?.message
                        }
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => remove(index)}
                    disabled={isSubmitting}
                    className="mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
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
          {isEditMode ? 'Update Supply Chain' : 'Create Supply Chain'}
        </Button>
      </div>
    </form>
  );
};

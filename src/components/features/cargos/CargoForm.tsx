import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Spinner } from '../../ui';
import { useToast } from '../../../hooks';
import { cargosApi, ordersApi, vehiclesApi, supplyChainsApi } from '../../../api';
import { createCargoSchema, updateCargoSchema, type CreateCargoFormData, type UpdateCargoFormData } from '../../../schemas';
import { useAuthStore, useUIStore } from '../../../stores';
import { CARGO_STATUS } from '../../../constants';
import type { Cargo, Order, Vehicle, SupplyChain, SupplyNodeConnection } from '../../../types';

interface CargoFormProps {
  cargo?: Cargo | null;
  mode: 'create' | 'edit';
  onSuccess?: () => void;
}

export const CargoForm: React.FC<CargoFormProps> = ({ cargo, mode, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [supplyChains, setSupplyChains] = useState<SupplyChain[]>([]);
  const [selectedSupplyChainId, setSelectedSupplyChainId] = useState<string>('');
  const [connections, setConnections] = useState<SupplyNodeConnection[]>([]);
  const [isLoadingConnections, setIsLoadingConnections] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const toast = useToast();
  const { user } = useAuthStore();
  const { closeDrawer } = useUIStore();
  const isEditMode = mode === 'edit';
  const schema = isEditMode ? updateCargoSchema : createCargoSchema;

  const form = useForm<CreateCargoFormData | UpdateCargoFormData>({
    resolver: zodResolver(schema),
    defaultValues: isEditMode && cargo ? {
      title: cargo.title,
      description: cargo.description,
      supplyNodeConnectionId: cargo.supply_node_connection_id,
      status: cargo.status,
      vehicleId: cargo.vehicle_id || undefined,
      orderId: cargo.order_id || undefined,
      responsibleId: cargo.responsible_id,
    } : {
      title: '',
      description: '',
      supplyNodeConnectionId: '',
      status: CARGO_STATUS.ASSEMBLY,
      vehicleId: undefined,
      orderId: undefined,
      responsibleId: user?.id || '',
    },
  });

  // Load orders, vehicles, and supply chains
  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, vehiclesData, supplyChainsData] = await Promise.all([
          ordersApi.getOrders(1, {}),
          vehiclesApi.getVehicles(1),
          supplyChainsApi.getSupplyChains(1),
        ]);
        setOrders(ordersData);
        setVehicles(vehiclesData);
        setSupplyChains(supplyChainsData);

        // If editing cargo with existing connection, find and select the supply chain
        if (isEditMode && cargo?.supply_node_connection_id) {
          // Try to find which supply chain contains this connection
          for (const chain of supplyChainsData) {
            try {
              const chainData = await supplyChainsApi.getSupplyChainById(chain.id);
              const hasConnection = chainData.supplyGraph?.connections?.some(
                conn => conn.id === cargo.supply_node_connection_id
              );
              if (hasConnection) {
                setSelectedSupplyChainId(chain.id);
                break;
              }
            } catch (error) {
              // Continue checking other chains
              console.error(`Error loading chain ${chain.id}:`, error);
            }
          }
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load data');
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, [cargo, isEditMode]);

  // Load connections when supply chain is selected
  useEffect(() => {
    const loadConnections = async () => {
      if (!selectedSupplyChainId) {
        setConnections([]);
        return;
      }

      setIsLoadingConnections(true);
      try {
        const supplyChainData = await supplyChainsApi.getSupplyChainById(selectedSupplyChainId);
        const chainConnections = supplyChainData.supplyGraph?.connections || [];
        setConnections(chainConnections);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load connections');
        setConnections([]);
      } finally {
        setIsLoadingConnections(false);
      }
    };

    loadConnections();
  }, [selectedSupplyChainId]);

  // Handle supply chain selection
  const handleSupplyChainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chainId = e.target.value;
    setSelectedSupplyChainId(chainId);
    // Reset connection selection when chain changes
    form.setValue('supplyNodeConnectionId', '');
  };

  const onSubmit = async (data: CreateCargoFormData | UpdateCargoFormData) => {
    setIsSubmitting(true);
    
    try {
      if (isEditMode && cargo) {
        const response = await cargosApi.updateCargo(cargo.id, data as UpdateCargoFormData);
        toast.success(response.message);
      } else {
        const response = await cargosApi.createCargo(data as CreateCargoFormData);
        toast.success(response.message);
      }
      closeDrawer();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} cargo`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
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
          placeholder="Enter cargo title"
          {...form.register('title')}
          error={form.formState.errors.title?.message}
          disabled={isSubmitting}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Enter cargo description"
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

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status *
        </label>
        <select
          id="status"
          {...form.register('status')}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value={CARGO_STATUS.ASSEMBLY}>Assembly</option>
          <option value={CARGO_STATUS.ON_THE_WAY}>On the way</option>
          <option value={CARGO_STATUS.DELAYED}>Delayed</option>
          <option value={CARGO_STATUS.DELIVERED}>Delivered</option>
        </select>
        {form.formState.errors.status && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.status.message}
          </p>
        )}
      </div>

      {/* Supply Chain Selection */}
      <div>
        <label htmlFor="supply_chain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Supply Chain *
        </label>
        <select
          id="supply_chain"
          value={selectedSupplyChainId}
          onChange={handleSupplyChainChange}
          disabled={isSubmitting || isLoadingData}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select supply chain</option>
          {supplyChains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.title}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          First select a supply chain to see available connections
        </p>
      </div>

      {/* Supply Node Connection Selection */}
      <div>
        <label htmlFor="supply_node_connection_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Connection Route *
        </label>
        {isLoadingConnections ? (
          <div className="flex items-center justify-center py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
            <Spinner size="sm" />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading connections...</span>
          </div>
        ) : (
          <>
            <select
              id="supply_node_connection_id"
              {...form.register('supplyNodeConnectionId')}
              disabled={isSubmitting || !selectedSupplyChainId || connections.length === 0}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">
                {!selectedSupplyChainId 
                  ? 'Select supply chain first' 
                  : connections.length === 0 
                    ? 'No connections available' 
                    : 'Select connection route'}
              </option>
              {connections.map((connection) => (
                <option key={connection.id} value={connection.id}>
                  {connection.start_node.title} → {connection.destination_node.title} ({connection.distance} km)
                </option>
              ))}
            </select>
            {form.formState.errors.supplyNodeConnectionId && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.supplyNodeConnectionId.message}
              </p>
            )}
            {selectedSupplyChainId && connections.length === 0 && !isLoadingConnections && (
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                This supply chain has no connections yet
              </p>
            )}
          </>
        )}
      </div>

      {/* Order */}
      <div>
        <label htmlFor="order_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Order (Optional)
        </label>
        <select
          id="order_id"
          {...form.register('orderId')}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">No order</option>
          {orders.map((order) => (
            <option key={order.id} value={order.id}>
              {order.title} - {order.status}
            </option>
          ))}
        </select>
        {form.formState.errors.orderId && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.orderId.message}
          </p>
        )}
      </div>

      {/* Vehicle */}
      <div>
        <label htmlFor="vehicle_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Vehicle (Optional)
        </label>
        <select
          id="vehicle_id"
          {...form.register('vehicleId')}
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">No vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.title}
            </option>
          ))}
        </select>
        {form.formState.errors.vehicleId && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.vehicleId.message}
          </p>
        )}
      </div>

      {/* Responsible (hidden, uses current user) */}
      <input type="hidden" {...form.register('responsibleId')} />

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
          {isEditMode ? 'Update Cargo' : 'Create Cargo'}
        </Button>
      </div>
    </form>
  );
};

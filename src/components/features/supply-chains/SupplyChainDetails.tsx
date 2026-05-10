import React, { useMemo } from 'react';
import { Network } from 'lucide-react';
import { Spinner } from '../../ui';
import { SupplyChainGraph } from './SupplyChainGraph';
import type { SupplyChainWithGraph } from '../../../types/supply-chain.types';

interface SupplyChainDetailsProps {
  supplyChain: SupplyChainWithGraph | null;
  isLoading: boolean;
  onConnectionClick?: (connectionId: string) => void;
}

interface NodeInfo {
  id: string;
  title: string;
  description: string | null;
  city: string;
  region: string;
  country: string;
}

interface ConnectionDisplay {
  id: string;
  from: NodeInfo;
  to: NodeInfo;
  distance: number;
}

export const SupplyChainDetails: React.FC<SupplyChainDetailsProps> = ({
  supplyChain,
  isLoading,
  onConnectionClick,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!supplyChain) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Supply chain not found</p>
      </div>
    );
  }

  // Extract all connections from the graph
  const connections = useMemo(() => {
    if (!supplyChain.supplyGraph) {
      return [];
    }

    // If graph has connections array, use it directly
    if ('connections' in supplyChain.supplyGraph && Array.isArray((supplyChain.supplyGraph as any).connections)) {
      const rawConnections = (supplyChain.supplyGraph as any).connections;
      return rawConnections.map((conn: any) => ({
        id: conn.id,
        from: {
          id: conn.start_node.id,
          title: conn.start_node.title,
          description: conn.start_node.description,
          city: conn.start_node.city,
          region: conn.start_node.region,
          country: conn.start_node.country,
        },
        to: {
          id: conn.destination_node.id,
          title: conn.destination_node.title,
          description: conn.destination_node.description,
          city: conn.destination_node.city,
          region: conn.destination_node.region,
          country: conn.destination_node.country,
        },
        distance: conn.distance,
      }));
    }

    // Fallback: traverse graph structure
    if (!supplyChain.supplyGraph.supplyNode) {
      return [];
    }

    const allConnections: ConnectionDisplay[] = [];
    const visited = new Set<string>();

    const traverse = (node: any) => {
      if (visited.has(node.id)) return;
      visited.add(node.id);

      if (node.next && Array.isArray(node.next)) {
        node.next.forEach((edge: any) => {
          allConnections.push({
            id: edge.conn_id,
            from: {
              id: node.id,
              title: node.title,
              description: node.description,
              city: node.city,
              region: node.region,
              country: node.country,
            },
            to: {
              id: edge.node.id,
              title: edge.node.title,
              description: edge.node.description,
              city: edge.node.city,
              region: edge.node.region,
              country: edge.node.country,
            },
            distance: edge.distance,
          });
          traverse(edge.node);
        });
      }
    };

    traverse(supplyChain.supplyGraph.supplyNode);
    return allConnections;
  }, [supplyChain.supplyGraph]);

  const hasConnections = connections.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {supplyChain.title}
        </h3>
        {supplyChain.description && (
          <p className="text-gray-600 dark:text-gray-400">
            {supplyChain.description}
          </p>
        )}
      </div>

      {/* Supply Chain Network */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-5 h-5 text-gray-500" />
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Supply Chain Network
          </h4>
        </div>

        {hasConnections ? (
          <SupplyChainGraph 
            connections={connections} 
            onConnectionClick={onConnectionClick}
          />
        ) : (
          <div className="text-center py-8">
            <Network className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No supply nodes connected yet
            </p>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
          Information
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Chain ID:</span>
            <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
              {supplyChain.id?.substring(0, 8) || 'N/A'}...
            </span>
          </div>
          {supplyChain.company_id && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Company ID:</span>
              <span className="text-gray-900 dark:text-gray-100 font-mono text-xs">
                {supplyChain.company_id.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

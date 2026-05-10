import React, { useMemo, useState } from 'react';
import { MapPin, ArrowRight, Network as NetworkIcon } from 'lucide-react';
import { Badge, Button } from '../../ui';
import { SupplyChainGraphVisualization } from './SupplyChainGraphVisualization';

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

interface SupplyChainGraphProps {
  connections: ConnectionDisplay[];
  onConnectionClick?: (connectionId: string) => void;
}

type ViewMode = 'graph' | 'list';

export const SupplyChainGraph: React.FC<SupplyChainGraphProps> = ({ 
  connections,
  onConnectionClick,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  // Get all unique nodes
  const allNodes = useMemo(() => {
    const nodesMap = new Map<string, NodeInfo>();
    
    connections.forEach((conn) => {
      if (!nodesMap.has(conn.from.id)) {
        nodesMap.set(conn.from.id, conn.from);
      }
      if (!nodesMap.has(conn.to.id)) {
        nodesMap.set(conn.to.id, conn.to);
      }
    });

    return Array.from(nodesMap.values());
  }, [connections]);

  // Calculate node statistics
  const nodeStats = useMemo(() => {
    const stats = new Map<string, { incoming: number; outgoing: number }>();
    
    connections.forEach((conn) => {
      // Outgoing from 'from' node
      const fromStats = stats.get(conn.from.id) || { incoming: 0, outgoing: 0 };
      fromStats.outgoing += 1;
      stats.set(conn.from.id, fromStats);
      
      // Incoming to 'to' node
      const toStats = stats.get(conn.to.id) || { incoming: 0, outgoing: 0 };
      toStats.incoming += 1;
      stats.set(conn.to.id, toStats);
    });

    return stats;
  }, [connections]);

  // Find root nodes (nodes with no incoming connections)
  const rootNodes = useMemo(() => {
    return allNodes.filter((node) => {
      const stats = nodeStats.get(node.id);
      return !stats || stats.incoming === 0;
    });
  }, [allNodes, nodeStats]);

  // Find leaf nodes (nodes with no outgoing connections)
  const leafNodes = useMemo(() => {
    return allNodes.filter((node) => {
      const stats = nodeStats.get(node.id);
      return !stats || stats.outgoing === 0;
    });
  }, [allNodes, nodeStats]);

  // Find intermediate nodes
  const intermediateNodes = useMemo(() => {
    return allNodes.filter((node) => {
      const stats = nodeStats.get(node.id);
      return stats && stats.incoming > 0 && stats.outgoing > 0;
    });
  }, [allNodes, nodeStats]);

  const renderNode = (node: NodeInfo, type: 'root' | 'intermediate' | 'leaf') => {
    const stats = nodeStats.get(node.id) || { incoming: 0, outgoing: 0 };
    
    const colorClasses = {
      root: 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20',
      intermediate: 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20',
      leaf: 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20',
    };

    const iconColors = {
      root: 'text-green-600',
      intermediate: 'text-blue-600',
      leaf: 'text-red-600',
    };

    return (
      <div
        key={node.id}
        className={`p-3 border-2 rounded-lg ${colorClasses[type]}`}
      >
        <div className="flex items-start gap-2">
          <MapPin className={`w-4 h-4 ${iconColors[type]} mt-0.5 flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <h6 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
              {node.title}
            </h6>
            {node.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                {node.description}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
              {node.city}, {node.country}
            </p>
            <div className="flex gap-2 text-xs">
              {stats.incoming > 0 && (
                <Badge variant="default" className="text-xs">
                  ↓ {stats.incoming} in
                </Badge>
              )}
              {stats.outgoing > 0 && (
                <Badge variant="default" className="text-xs">
                  ↑ {stats.outgoing} out
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'graph' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('graph')}
            className="flex items-center gap-2"
          >
            <NetworkIcon className="w-4 h-4" />
            Graph View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            List View
          </Button>
        </div>
      </div>

      {/* Graph Visualization */}
      {viewMode === 'graph' && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <SupplyChainGraphVisualization 
            connections={connections} 
            onConnectionClick={onConnectionClick}
          />
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            💡 Hover over connections to see cargo count • Click to view cargos • Hover over nodes for details
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                {rootNodes.length}
              </div>
              <div className="text-xs text-green-600 dark:text-green-500 mt-1">
                Starting Points
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                {intermediateNodes.length}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                Hubs
              </div>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                {leafNodes.length}
              </div>
              <div className="text-xs text-red-600 dark:text-red-500 mt-1">
                End Points
              </div>
            </div>
          </div>

          {/* Nodes by Type */}
          {rootNodes.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Starting Points ({rootNodes.length})
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rootNodes.map((node) => renderNode(node, 'root'))}
              </div>
            </div>
          )}

          {intermediateNodes.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                Distribution Hubs ({intermediateNodes.length})
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {intermediateNodes.map((node) => renderNode(node, 'intermediate'))}
              </div>
            </div>
          )}

          {leafNodes.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                End Points ({leafNodes.length})
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {leafNodes.map((node) => renderNode(node, 'leaf'))}
              </div>
            </div>
          )}

          {/* All Connections */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              All Connections ({connections.length})
            </h5>
            <div className="space-y-2">
              {connections.map((conn) => (
                <div
                  key={conn.id}
                  className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* From Node */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {conn.from.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 ml-5 truncate">
                        {conn.from.city}, {conn.from.country}
                      </p>
                    </div>

                    {/* Arrow and Distance */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <Badge variant="default" className="text-xs whitespace-nowrap">
                        {conn.distance} km
                      </Badge>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>

                    {/* To Node */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {conn.to.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 ml-5 truncate">
                        {conn.to.city}, {conn.to.country}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

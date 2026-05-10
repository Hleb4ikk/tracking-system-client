import React, { useMemo, useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { Spinner } from '../../ui';
import { cargosApi } from '../../../api';

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

interface SupplyChainGraphVisualizationProps {
  connections: ConnectionDisplay[];
  onConnectionClick?: (connectionId: string) => void;
}

interface NodePosition {
  x: number;
  y: number;
  node: NodeInfo;
}

interface ConnectionCargoCount {
  [connectionId: string]: number;
}

export const SupplyChainGraphVisualization: React.FC<SupplyChainGraphVisualizationProps> = ({
  connections,
  onConnectionClick,
}) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredConnection, setHoveredConnection] = useState<string | null>(null);
  const [cargoCountsByConnection, setCargoCountsByConnection] = useState<ConnectionCargoCount>({});
  const [loadingCargoCounts, setLoadingCargoCounts] = useState(false);

  // Calculate node positions using force-directed layout
  const nodePositions = useMemo(() => {
    if (connections.length === 0) return [];

    // Get all unique nodes
    const nodesMap = new Map<string, NodeInfo>();
    connections.forEach((conn) => {
      nodesMap.set(conn.from.id, conn.from);
      nodesMap.set(conn.to.id, conn.to);
    });

    const nodes = Array.from(nodesMap.values());
    const positions: NodePosition[] = [];

    // Simple circular layout for now
    const centerX = 400;
    const centerY = 300;
    const radius = Math.min(250, 150 + nodes.length * 10);

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI - Math.PI / 2;
      positions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        node,
      });
    });

    return positions;
  }, [connections]);

  // Load cargo counts for all connections
  useEffect(() => {
    const loadCargoCounts = async () => {
      if (connections.length === 0) return;

      setLoadingCargoCounts(true);
      try {
        const counts: ConnectionCargoCount = {};
        
        // Load counts for all connections in parallel
        await Promise.all(
          connections.map(async (conn) => {
            try {
              const count = await cargosApi.getCargoCountByConnection(conn.id);
              counts[conn.id] = count;
            } catch (error) {
              console.error(`Failed to load cargo count for connection ${conn.id}:`, error);
              counts[conn.id] = 0;
            }
          })
        );

        setCargoCountsByConnection(counts);
      } catch (error) {
        console.error('Failed to load cargo counts:', error);
      } finally {
        setLoadingCargoCounts(false);
      }
    };

    loadCargoCounts();
  }, [connections]);

  const getNodePosition = (nodeId: string): { x: number; y: number } | null => {
    const pos = nodePositions.find((p) => p.node.id === nodeId);
    return pos ? { x: pos.x, y: pos.y } : null;
  };

  const handleConnectionClick = (connectionId: string) => {
    if (onConnectionClick) {
      onConnectionClick(connectionId);
    }
  };

  if (connections.length === 0) {
    return (
      <div className="text-center py-12">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No connections to visualize
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <svg
        width="800"
        height="600"
        viewBox="0 0 800 600"
        className="w-full h-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
      >
        {/* Connections (lines) */}
        <g>
          {connections.map((conn) => {
            const fromPos = getNodePosition(conn.from.id);
            const toPos = getNodePosition(conn.to.id);

            if (!fromPos || !toPos) return null;

            const isHovered = hoveredConnection === conn.id;
            const cargoCount = cargoCountsByConnection[conn.id] || 0;

            // Calculate arrow
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const angle = Math.atan2(dy, dx);
            
            // Shorten line to not overlap with nodes
            const nodeRadius = 40;
            const startX = fromPos.x + nodeRadius * Math.cos(angle);
            const startY = fromPos.y + nodeRadius * Math.sin(angle);
            const endX = toPos.x - nodeRadius * Math.cos(angle);
            const endY = toPos.y - nodeRadius * Math.sin(angle);

            // Arrow head
            const arrowSize = 10;
            const arrowAngle = Math.PI / 6;
            const arrowX1 = endX - arrowSize * Math.cos(angle - arrowAngle);
            const arrowY1 = endY - arrowSize * Math.sin(angle - arrowAngle);
            const arrowX2 = endX - arrowSize * Math.cos(angle + arrowAngle);
            const arrowY2 = endY - arrowSize * Math.sin(angle + arrowAngle);

            return (
              <g key={conn.id}>
                {/* Line */}
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={isHovered ? '#3b82f6' : '#9ca3af'}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredConnection(conn.id)}
                  onMouseLeave={() => setHoveredConnection(null)}
                  onClick={() => handleConnectionClick(conn.id)}
                />
                
                {/* Arrow head */}
                <polygon
                  points={`${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`}
                  fill={isHovered ? '#3b82f6' : '#9ca3af'}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredConnection(conn.id)}
                  onMouseLeave={() => setHoveredConnection(null)}
                  onClick={() => handleConnectionClick(conn.id)}
                />

                {/* Distance label */}
                <text
                  x={(fromPos.x + toPos.x) / 2}
                  y={(fromPos.y + toPos.y) / 2 - 10}
                  textAnchor="middle"
                  className="fill-gray-600 dark:fill-gray-400 text-xs font-medium pointer-events-none"
                >
                  {conn.distance} km
                </text>

                {/* Cargo count badge */}
                {cargoCount > 0 && (
                  <g>
                    <circle
                      cx={(fromPos.x + toPos.x) / 2}
                      cy={(fromPos.y + toPos.y) / 2 + 15}
                      r="12"
                      fill={isHovered ? '#3b82f6' : '#60a5fa'}
                      className="transition-all cursor-pointer"
                      onMouseEnter={() => setHoveredConnection(conn.id)}
                      onMouseLeave={() => setHoveredConnection(null)}
                      onClick={() => handleConnectionClick(conn.id)}
                    />
                    <text
                      x={(fromPos.x + toPos.x) / 2}
                      y={(fromPos.y + toPos.y) / 2 + 20}
                      textAnchor="middle"
                      className="fill-white text-xs font-bold pointer-events-none"
                      style={{ fontSize: '10px' }}
                    >
                      {cargoCount}
                    </text>
                  </g>
                )}

                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={(fromPos.x + toPos.x) / 2 - 60}
                      y={(fromPos.y + toPos.y) / 2 + 35}
                      width="120"
                      height="40"
                      rx="4"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      className="drop-shadow-lg pointer-events-none"
                    />
                    <text
                      x={(fromPos.x + toPos.x) / 2}
                      y={(fromPos.y + toPos.y) / 2 + 52}
                      textAnchor="middle"
                      className="fill-gray-900 text-xs font-semibold pointer-events-none"
                    >
                      {cargoCount} cargo{cargoCount !== 1 ? 's' : ''}
                    </text>
                    <text
                      x={(fromPos.x + toPos.x) / 2}
                      y={(fromPos.y + toPos.y) / 2 + 67}
                      textAnchor="middle"
                      className="fill-gray-600 text-xs pointer-events-none"
                    >
                      Click to view
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes (circles) */}
        <g>
          {nodePositions.map((pos) => {
            const isHovered = hoveredNode === pos.node.id;
            const nodeRadius = 40;

            return (
              <g
                key={pos.node.id}
                onMouseEnter={() => setHoveredNode(pos.node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
              >
                {/* Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill={isHovered ? '#3b82f6' : '#60a5fa'}
                  stroke={isHovered ? '#1e40af' : '#2563eb'}
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all"
                />

                {/* Icon */}
                <circle
                  cx={pos.x}
                  cy={pos.y - 8}
                  r={3}
                  fill="white"
                  className="pointer-events-none"
                />
                <path
                  d={`M ${pos.x - 4} ${pos.y - 5} L ${pos.x} ${pos.y + 5} L ${pos.x + 4} ${pos.y - 5}`}
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  className="pointer-events-none"
                />

                {/* Title */}
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  className="fill-white text-xs font-semibold pointer-events-none"
                  style={{ fontSize: '11px' }}
                >
                  {pos.node.title.length > 12
                    ? pos.node.title.substring(0, 12) + '...'
                    : pos.node.title}
                </text>

                {/* Hover tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={pos.x - 80}
                      y={pos.y + nodeRadius + 10}
                      width="160"
                      height="60"
                      rx="4"
                      fill="white"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      className="drop-shadow-lg"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + nodeRadius + 28}
                      textAnchor="middle"
                      className="fill-gray-900 text-xs font-semibold"
                    >
                      {pos.node.title}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + nodeRadius + 45}
                      textAnchor="middle"
                      className="fill-gray-600 text-xs"
                    >
                      {pos.node.city}, {pos.node.country}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Loading indicator */}
      {loadingCargoCounts && (
        <div className="absolute top-2 right-2 flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <Spinner size="sm" />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Loading cargo counts...
          </span>
        </div>
      )}
    </div>
  );
};

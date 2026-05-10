// Supply Node Connection types
export interface SupplyNodeConnection {
  id: string;
  start_node: {
    id: string;
    title: string;
    description: string | null;
    country: string;
    zip: string;
    region: string;
    city: string;
    address_line: string;
    company_id: string;
  };
  destination_node: {
    id: string;
    title: string;
    description: string | null;
    country: string;
    zip: string;
    region: string;
    city: string;
    address_line: string;
    company_id: string;
  };
  supply_chain_id: string;
  distance: number;
}

// Supply Graph types
export interface SupplyGraphEdge {
  conn_id: string;
  node: SupplyGraphNode;
  distance: number;
}

export interface SupplyGraphNode {
  id: string;
  title: string;
  description: string | null;
  country: string;
  zip: string;
  region: string;
  city: string;
  address_line: string;
  company_id: string;
  next: SupplyGraphEdge[];
}

export interface SupplyGraph {
  supplyNode?: SupplyGraphNode;
  allNodes?: Map<string, SupplyGraphNode>;
  connections?: SupplyNodeConnection[];
}

// Supply Chain types
export interface SupplyChain {
  id: string;
  title: string;
  description: string | null;
  company_id: string;
}

export interface SupplyChainWithGraph extends SupplyChain {
  supplyGraph: SupplyGraph;
}

// DTOs for API
export interface CreateSupplyChainDto {
  title: string;
  description?: string | null;
  supply_node_connections?: Array<{
    startNodeId: string;
    destinationNodeId: string;
    distance: number;
  }>;
}

export interface UpdateSupplyChainDto {
  title?: string;
  description?: string | null;
  supply_node_connections?: Array<{
    startNodeId: string;
    destinationNodeId: string;
    distance: number;
  }>;
}

export interface SupplyChainFilters {
  title?: string;
  companyId?: string;
}

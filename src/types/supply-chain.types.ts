export interface SupplyNode {
  id: string;
  title: string;
  description: string | null;
  country: string;
  zip: string;
  region: string;
  city: string;
  address_line: string;
  company_id: string;
}

export interface SupplyNodeConnection {
  id: string;
  start_node: SupplyNode;
  destination_node: SupplyNode;
  distance: number;
  supply_chain_id: string;
}

export interface SupplyChain {
  id: string;
  title: string;
  description: string | null;
  company_id: string;
}

export interface SupplyChainWithConnections extends SupplyChain {
  supply_node_connections: SupplyNodeConnection[];
}

export interface CreateSupplyChainDto {
  title: string;
  description?: string;
}

export interface UpdateSupplyChainDto {
  title?: string;
  description?: string;
}

export interface CreateSupplyNodeDto {
  title: string;
  description?: string;
  country: string;
  zip: string;
  region: string;
  city: string;
  address_line: string;
}

export interface UpdateSupplyNodeDto {
  title?: string;
  description?: string;
  country?: string;
  zip?: string;
  region?: string;
  city?: string;
  address_line?: string;
}

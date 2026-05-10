export type CargoStatus = 'assembly' | 'on the way' | 'delayed' | 'delivered';

export interface Cargo {
  id: string;
  title: string;
  description: string;
  supply_node_connection_id: string;
  status: CargoStatus;
  vehicle_id: string | null;
  order_id: string | null;
  responsible_id: string;
  company_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCargoDto {
  title: string;
  description: string;
  supplyNodeConnectionId: string;
  status: CargoStatus;
  vehicleId?: string;
  orderId?: string;
  responsibleId: string;
}

export interface UpdateCargoDto {
  title?: string;
  description?: string;
  supplyNodeConnectionId?: string;
  status?: CargoStatus;
  vehicleId?: string;
  orderId?: string;
  responsibleId?: string;
}

export interface CargoFilters {
  status?: CargoStatus;
  vehicleId?: string;
  orderId?: string;
  responsibleId?: string;
  companyId?: string;
  supplyNodeConnectionId?: string;
}

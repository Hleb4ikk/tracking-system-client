import { type Cargo } from './cargo.types';
import { type Receiver } from './receiver.types';

export interface Order {
  id: string;
  title: string;
  status: string;
  description: string | null;
  company_id: string;
  responsible_id: string;
  reciever_id: string;
}

export interface StatusHistory {
  id: string;
  title: string;
  created_at: Date;
  company_id: string;
  order_id: string;
}

export interface OrderWithHistory extends Order {
  status_history: StatusHistory[];
}

export interface OrderWithDetails extends Order {
  status_history: StatusHistory[];
  cargos: Cargo[];
  reciever: Receiver;
}

export interface CreateOrderDto {
  title: string;
  status: string;
  description?: string;
  responsibleId: string;
  recieverId: string;
}

export interface UpdateOrderDto {
  title?: string;
  status?: string;
  description?: string;
  responsibleId?: string;
  recieverId?: string;
}

export interface OrderFilters {
  title?: string;
  status?: string;
  responsibleId?: string;
  recieverId?: string;
  companyId?: string;
}

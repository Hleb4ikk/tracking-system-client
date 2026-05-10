export type DeliveryType = 'land' | 'water' | 'air';

export interface Vehicle {
  id: string;
  title: string;
  delivery_type: DeliveryType;
  company_id: string;
  cargo_id: string | null;
}

export interface CreateVehicleDto {
  title: string;
  deliveryType: DeliveryType;
}

export interface UpdateVehicleDto {
  title?: string;
  deliveryType?: DeliveryType;
  cargoId?: string | null;
}

export interface VehicleFilters {
  title?: string;
  deliveryType?: DeliveryType;
  companyId?: string;
}

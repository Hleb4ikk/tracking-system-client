export interface Vehicle {
  id: string;
  title: string;
  description: string | null;
  company_id: string;
  cargo_id: string | null;
}

export interface CreateVehicleDto {
  title: string;
  description?: string;
}

export interface UpdateVehicleDto {
  title?: string;
  description?: string;
  cargo_id?: string;
}

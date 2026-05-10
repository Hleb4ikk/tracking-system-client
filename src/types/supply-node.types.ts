// Domain types - snake_case (from API response)
export interface SupplyNode {
  id: string;
  title: string;
  description: string | null;
  country: string;
  zip: string;
  region: string;
  city: string;
  address_line: string;  // snake_case
  company_id: string;
}

// DTOs - snake_case (to match backend exactly)
export interface CreateSupplyNodeDto {
  title: string;
  description?: string | null;
  country: string;
  zip: string;
  region: string;
  city: string;
  address_line: string;  // snake_case to match backend
}

export interface UpdateSupplyNodeDto {
  title?: string;
  description?: string | null;
  country?: string;
  zip?: string;
  region?: string;
  city?: string;
  address_line?: string;  // snake_case to match backend
}

export interface SupplyNodeFilters {
  title?: string;
  country?: string;
  city?: string;
  region?: string;
}

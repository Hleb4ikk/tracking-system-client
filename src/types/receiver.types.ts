export interface Receiver {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  zip: string;
  region: string;
  city: string;
  address_line: string;
  company_id: string;
}

export interface CreateReceiverDto {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  zip: string;
  region: string;
  city: string;
  address_line: string;
}

export interface UpdateReceiverDto {
  first_name?: string;
  last_name?: string;
  phone?: string;
  country?: string;
  zip?: string;
  region?: string;
  city?: string;
  address_line?: string;
}

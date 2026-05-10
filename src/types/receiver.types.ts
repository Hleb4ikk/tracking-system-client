export interface Receiver {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  company_id: string;
}

export interface CreateReceiverDto {
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export interface UpdateReceiverDto {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
}

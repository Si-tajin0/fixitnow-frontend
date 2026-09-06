export type LoginData = {
  email?: string;
  password?: string;
  [key: string]: unknown;
};

export type RegisterData = {
  name?: string;
  email?: string;
  password?: string;
  role?: "CUSTOMER" | "TECHNICIAN";
};

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Technician {
  id: string;
  name: string;
  address: string;
  rating: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  technicianId: string;
  category?: Category;
  technician?: Technician;
}

export interface BookingRequestData {
  serviceId: string;
  technicianId: string;
  serviceDate: string;
  scheduledTime: string;
}

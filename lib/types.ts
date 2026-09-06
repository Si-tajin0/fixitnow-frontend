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

export interface Booking {
  id: string;
  serviceId: string;
  technicianId: string;
  customerId: string;
  serviceDate: string;
  scheduledTime: string;
  status:
    | "REQUESTED"
    | "ACCEPTED"
    | "PAID"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "DECLINED"
    | "CANCELLED";
  service?: Service;
  technician?: Technician;
}

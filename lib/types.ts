export type LoginData = {
  email?: string;
  password?: string;
};

export type RegisterData = {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  role?: "CUSTOMER" | "TECHNICIAN";
  skills?: string;
  experience?: string | number;
  pricing?: string | number;
};

export interface BackendRegisterPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: "CUSTOMER" | "TECHNICIAN";
  phone?: string;
  address?: string;
  technicianProfile?: {
    skills: string[];
    experience: number;
    pricing: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface TechnicianProfileDetails {
  skills: string[];
  experience: number;
  pricing: number;
  isAvailable: boolean;
}
export interface Technician {
  id: string;
  name: string;
  address: string;
  rating: number;
  technicianProfile?: TechnicianProfileDetails;
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

export interface CreateServicePayload {
  name: string;
  description: string;
  price: number;
  categoryId: string;
}

export interface UpdateTechnicianProfilePayload {
  skills: string[];
  experience: number;
  pricing: number;
  isAvailable: boolean;
}

export interface TechnicianDisplayProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  rating: number;
  technicianProfile: {
    skills: string[];
    experience: number;
    pricing: number;
    isAvailable: boolean;
  } | null;
  reviews?: Review[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
}

export interface ReviewPayload {
  bookingId: string;
  rating: number;
  comment: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  technicianId: string;
  customerId: string;
  customer?: {
    name: string;
    email?: string;
  };
  booking?: {
    technicianId?: string;
    technician?: {
      name: string;
    };
    service?: {
      name: string;
    };
  };
}

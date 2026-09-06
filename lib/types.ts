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

import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export interface CustomJwtPayload {
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
  email: string;
  exp: number;
}

export const getCurrentUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    return decoded;
  } catch (error) {
    return null;
  }
};

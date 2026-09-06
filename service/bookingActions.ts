"use server";

import { proxy } from "@/apiFetcher";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "./auth.sevice";
import { BookingRequestData, Service } from "@/lib/types";

export const getSingleServiceAction = async (
  id: string,
): Promise<Service | null> => {
  try {
    const response = await proxy(`/api/services`);

    if (!response.ok) return null;

    const allServices: Service[] = response.data?.data || response.data || [];

    const singleService = allServices.find((service) => service.id === id);

    return singleService || null;
  } catch (error) {
    return null;
  }
};

export const createBookingAction = async (bookingData: BookingRequestData) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please login first." };
    }

    const decoded = jwtDecode<CustomJwtPayload>(token);
    if (decoded.role !== "CUSTOMER") {
      return { success: false, message: "Only CUSTOMERS can book services!" };
    }

    const response = await proxy("/api/bookings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      let errorMsg = response.data?.message || "Failed to book service!";

      if (errorMsg.includes("Prisma") || errorMsg.length > 50) {
        errorMsg = "Something went wrong on the server. Please try again!";
      }
      return {
        success: false,
        message: errorMsg,
      };
    }

    return { success: true, message: "Booking requested successfully!" };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

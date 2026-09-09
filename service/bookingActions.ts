"use server";

import { proxy } from "@/apiFetcher";
import { Booking, BookingRequestData, Service, Technician } from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface CustomJwtPayload {
  role: string;
  email: string;
}

export const getSingleServiceAction = async (
  id: string,
): Promise<Service | null> => {
  try {
    const allRes = await proxy(`/api/services`);
    const allServices: Service[] = allRes.data?.data || allRes.data || [];

    const singleService = allServices.find(
      (s: Service) => s.id === id || s.technicianId === id,
    );

    if (!singleService) return null;

    const techRes = await proxy(`/api/technicians`);
    const allTechnicians: Technician[] =
      techRes.data?.data || techRes.data || [];

    const matchingTech = allTechnicians.find(
      (t: Technician) => t.id === singleService.technicianId,
    );

    if (matchingTech && matchingTech.technicianProfile?.pricing) {
      singleService.price = matchingTech.technicianProfile.pricing;
    }

    return singleService;
  } catch (error) {
    return null;
  }
};

// create booking action
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      let errorMsg = response.data?.message || "Failed to book service!";
      if (errorMsg.includes("Prisma") || errorMsg.length > 50) {
        errorMsg = "Something went wrong on the server. Please try again!";
      }
      return { success: false, message: errorMsg };
    }

    return { success: true, message: "Booking requested successfully!" };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

// get my booking action
export const getMyBookingsAction = async (): Promise<Booking[]> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return [];

    const response = await proxy("/api/bookings", {
      headers: { Authorization: `Bearer ${token}` },
    });

    let bookings: Booking[] = response.data?.data || response.data || [];

    const techRes = await proxy(`/api/technicians`);
    const allTechnicians: Technician[] =
      techRes.data?.data || techRes.data || [];

    bookings = bookings.map((booking: Booking) => {
      const matchingTech = allTechnicians.find(
        (t: Technician) => t.id === booking.technicianId,
      );

      if (matchingTech && matchingTech.technicianProfile?.pricing) {
        if (booking.service) {
          booking.service.price = matchingTech.technicianProfile.pricing;
        }
      }
      return booking;
    });

    return bookings;
  } catch (error) {
    return [];
  }
};

// technician updated booking action
export const updateBookingStatusAction = async (id: string, status: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token)
      return { success: false, message: "Unauthorized. Please login first." };

    const response = await proxy(`/api/technician/bookings/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Failed to update status!",
      };
    }

    return { success: true, message: `Booking marked as ${status}!` };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

// customer cancel booking action
export const cancelBookingAction = async (id: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return { success: false, message: "Unauthorized." };

    const response = await proxy(`/api/bookings/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "CANCELLED" }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Failed to cancel booking!",
      };
    }

    return { success: true, message: "Booking cancelled successfully!" };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

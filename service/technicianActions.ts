"use server";

import { proxy } from "@/apiFetcher";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  CreateServicePayload,
  Service,
  Technician,
  UpdateTechnicianProfilePayload,
} from "@/lib/types";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "./auth.service";

// Get profile
export const getTechnicianProfileAction = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;

    const userResponse = await proxy("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const rawUserData = userResponse.data?.data || userResponse.data || {};
    const userData = rawUserData.profile || rawUserData;

    if (!userData.id) return userData;

    const techResponse = await proxy(`/api/technicians`);
    const allTechnicians = techResponse.data?.data || techResponse.data || [];

    const myTechProfile = allTechnicians.find(
      (t: Technician) => t.id === userData.id,
    );

    return {
      ...userData,
      technicianProfile: myTechProfile?.technicianProfile || null,
    };
  } catch (error) {
    return null;
  }
};

// Update profile
export const updateTechnicianProfileAction = async (
  profileData: UpdateTechnicianProfilePayload,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return { success: false, message: "Unauthorized" };

    const response = await proxy("/api/technician/profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Failed to update profile!",
      };
    }

    revalidatePath("/dashboard/technician/profile");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

// Get All public technician

export const getAllPublicTechniciansAction = async (
  searchParams?: string,
): Promise<Technician[]> => {
  try {
    const query = searchParams ? `?${searchParams}` : "";

    const [techRes, serviceRes] = await Promise.all([
      proxy(`/api/technicians${query}`),
      proxy(`/api/services`),
    ]);

    const allTechnicians: Technician[] =
      techRes.data?.data || techRes.data || [];
    const allServices: Service[] =
      serviceRes.data?.data || serviceRes.data || [];

    const validTechnicians = allTechnicians.filter((tech: Technician) => {
      return allServices.some(
        (service: Service) => service.technicianId === tech.id,
      );
    });

    return validTechnicians;
  } catch (error) {
    return [];
  }
};

// Get my role action

export const getMyRoleAction = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;

    const decoded = jwtDecode<CustomJwtPayload>(token);
    return decoded.role;
  } catch (error) {
    return null;
  }
};

// get public technician id action

export const getPublicTechnicianByIdAction = async (
  id: string,
): Promise<Technician | null> => {
  try {
    const response = await proxy(`/api/technicians`);

    if (!response.ok) return null;

    let allTechnicians = response.data?.data || response.data || [];

    if (!Array.isArray(allTechnicians)) {
      allTechnicians = [];
    }

    const singleTechnician = allTechnicians.find(
      (t: Technician) => t.id === id,
    );

    return singleTechnician || null;
  } catch (error) {
    console.error("Action Error:", error);
    return null;
  }
};

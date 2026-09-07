// service/technicianActions.ts
"use server";

import { proxy } from "@/apiFetcher";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { UpdateTechnicianProfilePayload } from "@/lib/types";
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

    if (!userData.id) {
      console.error("User ID not found!", userData);
      return userData;
    }

    const techResponse = await proxy(`/api/technicians/${userData.id}`);

    const fullTechData = techResponse.data?.data || techResponse.data || {};

    const finalData = {
      ...userData,
      technicianProfile: fullTechData.technicianProfile || null,
    };

    return finalData;
  } catch (error) {
    console.error("Action Error:", error);
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

export const getAllPublicTechniciansAction = async (searchParams?: string) => {
  try {
    const query = searchParams ? `?${searchParams}` : "";

    const response = await proxy(`/api/technicians${query}`);

    if (!response.ok) return [];
    return response.data?.data || response.data || [];
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

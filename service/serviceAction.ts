"use server";

import { proxy } from "@/apiFetcher";

export const fetchServicesAction = async () => {
  try {
    const response = await proxy("/api/services");

    if (!response.ok) {
      throw new Error(response.data?.message || "Failed to fetch services");
    }

    return response.data?.data || response.data;
  } catch (error) {
    console.error("Service Fetch Error:", error);
    return [];
  }
};

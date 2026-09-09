"use server";

import { proxy } from "@/apiFetcher";
import { CreateServicePayload, Service, Technician } from "@/lib/types";
import { cookies } from "next/headers";

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

// get All categories action

export const getCategoriesAction = async () => {
  try {
    const cookieStroe = await cookies();
    const token = cookieStroe.get("accessToken")?.value;

    const response = await proxy("/api/admin/categories", {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log("Category Fetch Response:", response);
    if (!response.ok) return [];
    return response.data?.data || response.data || [];
  } catch (error) {
    return [];
  }
};

// create category service action
export const createServiceAction = async (
  serviceData: CreateServicePayload,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return { success: false, message: "Unauthorized" };

    const response = await proxy("/api/admin/categories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(serviceData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Failed to create service",
      };
    }

    return { success: true, message: "Service created successfully!" };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

// Get all public service action

export const getAllPublicServicesAction = async (
  searchParams?: string,
): Promise<Service[]> => {
  try {
    const query = searchParams ? `?${searchParams}` : "";

    console.log("🕵️‍♂️ FETCHING SERVICES URL:", `/api/services${query}`);

    const [servicesRes, techRes] = await Promise.all([
      proxy(`/api/services${query}`),
      proxy(`/api/technicians`),
    ]);

    let services: Service[] = servicesRes.data?.data || servicesRes.data || [];
    const technicians: Technician[] = techRes.data?.data || techRes.data || [];

    if (!Array.isArray(services)) {
      return [];
    }

    services = services.map((service: Service) => {
      const matchingTech = technicians.find(
        (t: Technician) => t.id === service.technicianId,
      );

      if (matchingTech && matchingTech.technicianProfile?.pricing) {
        service.price = matchingTech.technicianProfile.pricing;
      }
      return service;
    });

    return services;
  } catch (error) {
    console.error("Action Error:", error);
    return [];
  }
};

// Get all public category action
export const getPublicCategoriesAction = async () => {
  try {
    const response = await proxy("/api/categories");
    if (!response.ok) return [];
    return response.data?.data || response.data || [];
  } catch (error) {
    return [];
  }
};

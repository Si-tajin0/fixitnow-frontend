"use server";

import { proxy } from "@/apiFetcher";
import { User } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface CreateCategoryPayload {
  name: string;
  description: string;
}

export const createCategoryAction = async (
  categoryData: CreateCategoryPayload,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token)
      return {
        success: false,
        message: "Unauthorized. Admin access required.",
      };

    const response = await proxy("/api/admin/categories", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Failed to create category!",
      };
    }

    revalidatePath("/dashboard/admin/categories");

    return { success: true, message: "Category created successfully!" };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

// Get All user action

export const getAllUsersAction = async (): Promise<User[]> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return [];

    const response = await proxy("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return [];
    return response.data?.data || response.data || [];
  } catch (error) {
    return [];
  }
};

// update status action
export const updateUserStatusAction = async (
  userId: string,
  status: "ACTIVE" | "BLOCKED",
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return { success: false, message: "Unauthorized" };

    const response = await proxy(`/api/admin/users/${userId}`, {
      method: "PATCH", // বা PUT
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

    return { success: true, message: `User successfully marked as ${status}!` };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

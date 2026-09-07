"use server";

import { proxy } from "@/apiFetcher";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

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

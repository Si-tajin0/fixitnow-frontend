// service/customerActions.ts
"use server";

import { proxy } from "@/apiFetcher";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface UpdateCustomerPayload {
  name: string;
  phone: string;
  address: string;
}

export const getCustomerProfileAction = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return null;

    const response = await proxy("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;

    const rawData = response.data?.data || response.data || {};
    return rawData.profile || rawData;
  } catch (error) {
    return null;
  }
};

// 💡 userId প্যারামিটার রিমুভ করে দিলাম, শুধু পেলোড নিবে
export const updateCustomerProfileAction = async (
  profileData: UpdateCustomerPayload,
) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) return { success: false, message: "Unauthorized" };

    const response = await proxy(`/api/users/update-profile`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Failed to update profile!",
      };
    }

    revalidatePath("/dashboard/customer/profile");
    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

"use server";

import { proxy } from "@/apiFetcher";
import { BackendRegisterPayload, LoginData, RegisterData } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Login user
export const loginUserAction = async (formData: LoginData) => {
  try {
    const response = await proxy("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      let errorMsg = response.data?.message || "Login failed!";

      if (
        errorMsg.toLowerCase().includes("block") ||
        errorMsg.toLowerCase().includes("ban")
      ) {
        return { success: false, message: `🚨 Access Denied: ${errorMsg}` };
      }

      if (
        errorMsg.includes("Prisma") ||
        errorMsg.includes("findUnique") ||
        errorMsg.length > 60
      ) {
        errorMsg = "Invalid email or password. Please try again!";
      }
      return { success: false, message: errorMsg };
    }

    const token = response.data?.data?.accessToken;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    revalidatePath("/");
    revalidatePath("/dashboard");

    return { success: true, message: "Login Successful!", data: response.data };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

// Register user

export const registerUserAction = async (formData: RegisterData) => {
  try {
    const payload: BackendRegisterPayload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone || "",
      address: formData.address || "",
    };

    if (formData.role === "TECHNICIAN") {
      payload.technicianProfile = {
        skills: formData.skills
          ? formData.skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        experience: Number(formData.experience) || 0,
        pricing: Number(formData.pricing) || 0,
      };
    }

    const response = await proxy("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Registration failed!",
      };
    }

    return { success: true, message: "Registration Successful! Please login." };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

export const logoutUserAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  revalidatePath("/");
  return { success: true };
};

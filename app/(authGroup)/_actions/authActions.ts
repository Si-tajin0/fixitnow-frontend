"use server";

import { proxy } from "@/apiFetcher";
import { LoginData, RegisterData } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Login user
export async function loginUserAction(fromData: LoginData) {
  try {
    const response = await proxy("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(fromData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Login Failed",
      };
    }
    const token = response.data?.data?.accessToken;

    if (token) {
      const cookieStore = await cookies();
      cookieStore.set("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Login Successfull!",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong!",
      error,
    };
  }
}

// Register

export const registerUserAction = async (fromData: RegisterData) => {
  try {
    const response = await proxy("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(fromData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Register Failed!",
      };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    return {
      success: true,
      message: "Register Successful! Please Login.",
      data: response.data,
    };
  } catch (error) {
    return { success: false, messsage: "Something went Wrong!", error };
  }
};

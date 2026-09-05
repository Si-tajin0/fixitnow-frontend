"use server";

import { proxy } from "@/apiFetcher";
import { cookies } from "next/headers";

type LoginData = {
  email?: string;
  password?: string;
  [key: string]: unknown;
};

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

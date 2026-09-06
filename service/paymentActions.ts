"use server";

import { proxy } from "@/apiFetcher";
import { cookies } from "next/headers";

export const createPaymentAction = async (bookingId: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized. Please login first." };
    }

    const response = await proxy("/api/payments/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Failed to initiate payment!",
      };
    }

    const paymentUrl =
      response.data?.data?.paymentUrl ||
      response.data?.data?.url ||
      response.data?.url;

    if (paymentUrl) {
      return { success: true, paymentUrl };
    } else {
      return {
        success: false,
        message: "Could not get payment link from server!",
      };
    }
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

// Confirm payment action
export const confirmPaymentAction = async (transactionId: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return { success: false, message: "Unauthorized." };

    const response = await proxy("/api/payments/confirm", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ transactionId }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Payment verification failed!",
      };
    }

    return {
      success: true,
      message: "Payment verified and status updated to PAID!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong during verification!",
    };
  }
};

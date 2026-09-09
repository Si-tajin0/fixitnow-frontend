"use server";

import { proxy } from "@/apiFetcher";
import { cookies } from "next/headers";
import { Review, ReviewPayload } from "@/lib/types";

export const createReviewAction = async (reviewData: ReviewPayload) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token)
      return { success: false, message: "Unauthorized. Please login." };

    const response = await proxy("/api/reviews", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: response.data?.message || "Failed to submit review!",
      };
    }

    return {
      success: true,
      message: "Review submitted successfully! Thank you.",
    };
  } catch (error) {
    return { success: false, message: "Something went wrong!" };
  }
};

// get technician review action display

export const getTechnicianReviewsAction = async (
  technicianId: string,
): Promise<Review[]> => {
  try {
    const response = await proxy("/api/reviews");

    if (!response.ok) return [];

    const allReviews: Review[] = response.data?.data || response.data || [];

    const techReviews = allReviews.filter((review: Review) => {
      return (
        review.booking?.technicianId === technicianId ||
        review.technicianId === technicianId
      );
    });

    return techReviews;
  } catch (error) {
    return [];
  }
};

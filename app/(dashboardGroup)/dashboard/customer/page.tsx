// app/(dashboardGroup)/dashboard/customer/page.tsx
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Star, LayoutList } from "lucide-react";

import { useBookings } from "@/hooks/useBookings";
import { cancelBookingAction } from "@/service/bookingActions";
import { createPaymentAction } from "@/service/paymentActions";
import { createReviewAction } from "@/service/reviewActions";
import { Booking } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reviewSchema = z.object({
  rating: z.string().min(1, "Please select a rating"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function CustomerDashboardPage() {
  const { data: bookings, isLoading, isError } = useBookings();
  const queryClient = useQueryClient();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
  });

  const handleCancel = async (id: string) => {
    setLoadingId(id);
    const result = await cancelBookingAction(id);
    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    } else {
      toast.error(result.message);
    }
    setLoadingId(null);
  };

  const handlePayment = async (id: string) => {
    setLoadingId(id);
    const result = await createPaymentAction(id);
    if (result.success && result.paymentUrl) {
      window.location.href = result.paymentUrl;
    } else {
      toast.error(result.message);
      setLoadingId(null);
    }
  };

  const onReviewSubmit = async (data: ReviewFormValues) => {
    if (!reviewBooking) return;
    setIsReviewSubmitting(true);

    const payload = {
      bookingId: reviewBooking.id,
      rating: Number(data.rating),
      comment: data.comment,
    };

    const result = await createReviewAction(payload);

    if (result.success) {
      toast.success(result.message);
      setReviewBooking(null);
      reset();
    } else {
      toast.error(result.message);
    }
    setIsReviewSubmitting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REQUESTED":
        return "bg-yellow-100 text-yellow-800";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "PAID":
        return "bg-purple-100 text-purple-800";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "DECLINED":
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
        <LayoutList className="mr-3 text-blue-600" /> My Bookings
      </h1>

      {isLoading && (
        <div className="text-center text-lg font-medium animate-pulse">
          Loading your bookings...
        </div>
      )}
      {isError && (
        <div className="text-center text-red-500">Failed to load bookings!</div>
      )}

      {!isLoading && bookings?.length === 0 && (
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">
            You haven&apos;t booked any services yet.
          </p>
        </div>
      )}

      <div className="grid gap-6">
        {bookings?.map((booking: Booking) => (
          <Card
            key={booking.id}
            className="shadow-sm border-t-4 border-t-blue-500"
          >
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 rounded-t-lg pb-4">
              <div>
                <CardTitle className="text-xl text-gray-800">
                  {booking.service?.name || "Service Details Unavailable"}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  Date: {booking.serviceDate} | Time: {booking.scheduledTime}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold ${getStatusBadge(booking.status)}`}
              >
                {booking.status}
              </span>
            </CardHeader>

            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-gray-600 font-medium">
                  Technician:{" "}
                  <span className="text-gray-900 font-bold">
                    {booking.technician?.name || "Pending..."}
                  </span>
                </p>
                <p className="text-3xl font-black text-blue-600 mt-2">
                  ${booking.service?.price || 0}
                </p>
              </div>

              <div className="space-x-3">
                {booking.status === "REQUESTED" && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={() => handleCancel(booking.id)}
                    disabled={loadingId === booking.id}
                  >
                    {loadingId === booking.id ? "Cancelling..." : "Cancel"}
                  </Button>
                )}

                {booking.status === "ACCEPTED" && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 px-8 cursor-pointer shadow-md"
                    onClick={() => handlePayment(booking.id)}
                    disabled={loadingId === booking.id}
                  >
                    {loadingId === booking.id ? "Redirecting..." : "Pay Now"}
                  </Button>
                )}

                {booking.status === "COMPLETED" && (
                  <Button
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-50 cursor-pointer shadow-sm"
                    onClick={() => setReviewBooking(booking)}
                  >
                    <Star className="w-4 h-4 mr-2 fill-current" /> Leave a
                    Review
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!reviewBooking}
        onOpenChange={(open) => !open && setReviewBooking(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with{" "}
              {reviewBooking?.technician?.name || "the technician"}.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onReviewSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Select
                onValueChange={(val) => setValue("rating", val as string)}
              >
                <SelectTrigger className="w-full cursor-pointer py-6">
                  <SelectValue placeholder="Select a rating" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num} -{" "}
                      {num === 5 ? "Excellent" : num === 1 ? "Poor" : "Stars"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rating && (
                <p className="text-sm text-red-500">{errors.rating.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Comment</Label>
              <Textarea
                placeholder="Write your feedback here..."
                className="resize-none"
                rows={4}
                {...register("comment")}
              />
              {errors.comment && (
                <p className="text-sm text-red-500">{errors.comment.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-lg py-6"
              disabled={isReviewSubmitting}
            >
              {isReviewSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

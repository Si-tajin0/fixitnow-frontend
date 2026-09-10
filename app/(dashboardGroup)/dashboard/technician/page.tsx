"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { useBookings } from "@/hooks/useBookings";
import { updateBookingStatusAction } from "@/service/bookingActions";
import { Booking } from "@/lib/types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TechnicianDashboardPage = () => {
  const { data: bookings, isLoading, isError } = useBookings();
  const queryClient = useQueryClient();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const result = await updateBookingStatusAction(id, newStatus);

    if (result.success) {
      toast.success(result.message);
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    } else {
      toast.error(result.message);
    }
    setLoadingId(null);
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
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "DECLINED":
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Job Requests 🧑‍🔧</h1>

      {isLoading && (
        <div className="text-center text-lg font-medium animate-pulse">
          Loading job requests...
        </div>
      )}

      {isError && (
        <div className="text-center text-red-500">Failed to load requests!</div>
      )}

      {!isLoading && bookings?.length === 0 && (
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border">
          <p className="text-gray-500 text-lg">
            You don&apos;t have any job requests yet.
          </p>
        </div>
      )}

      <div className="grid gap-6">
        {bookings?.map((booking: Booking) => (
          <Card key={booking.id} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between bg-gray-50 rounded-t-lg pb-4">
              <div>
                <CardTitle className="text-xl text-blue-600">
                  {booking.service?.name || "Service Details Unavailable"}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Date: {new Date(booking.serviceDate).toLocaleDateString()} |
                  Time: {booking.scheduledTime}
                </p>
              </div>
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusBadge(booking.status)}`}
              >
                {booking.status}
              </span>
            </CardHeader>

            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-gray-700 font-medium">
                  Customer ID: {booking.customerId}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${booking.service?.price || 0}
                </p>
              </div>

              <div className="space-x-3">
                {booking.status === "REQUESTED" && (
                  <>
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50 cursor-pointer"
                      onClick={() => handleStatusUpdate(booking.id, "DECLINED")}
                      disabled={loadingId === booking.id}
                    >
                      Decline
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white px-8 cursor-pointer"
                      onClick={() => handleStatusUpdate(booking.id, "ACCEPTED")}
                      disabled={loadingId === booking.id}
                    >
                      {loadingId === booking.id ? "Processing..." : "Accept"}
                    </Button>
                  </>
                )}

                {booking.status === "PAID" && (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 px-8 cursor-pointer"
                    onClick={() =>
                      handleStatusUpdate(booking.id, "IN_PROGRESS")
                    }
                    disabled={loadingId === booking.id}
                  >
                    Start Job
                  </Button>
                )}

                {booking.status === "IN_PROGRESS" && (
                  <Button
                    className="bg-gray-800 hover:bg-gray-900 text-white px-8 cursor-pointer"
                    onClick={() => handleStatusUpdate(booking.id, "COMPLETED")}
                    disabled={loadingId === booking.id}
                  >
                    Mark Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TechnicianDashboardPage;

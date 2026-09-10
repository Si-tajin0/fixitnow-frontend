"use client";

import { useBookings } from "@/hooks/useBookings";
import { Booking } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CreditCard, CheckCircle2, Loader2 } from "lucide-react";

export default function CustomerPaymentHistoryPage() {
  const { data: bookings, isLoading, isError } = useBookings();

  const paidBookings =
    bookings?.filter(
      (b: Booking) => b.status === "PAID" || b.status === "COMPLETED",
    ) || [];

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center">
        <CreditCard className="mr-3 text-blue-600" /> Payment History
      </h1>

      <Card className="shadow-sm border-t-4 border-t-green-500">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-xl text-gray-800">
            Successful Transactions
          </CardTitle>
          <CardDescription>
            A complete record of your paid services.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500">
              Failed to load payment history!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b">
                  <tr>
                    <th className="px-6 py-4">Service Name</th>
                    <th className="px-6 py-4">Technician</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {paidBookings.length > 0 ? (
                    paidBookings.map((booking: Booking) => (
                      <tr
                        key={`payment-${booking.id}`}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-gray-900">
                          {booking.service?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {booking.technician?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4">{booking.serviceDate}</td>
                        <td className="px-6 py-4 font-black text-blue-600 text-lg">
                          ${booking.service?.price || 0}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full flex w-fit items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> PAID
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-gray-500 font-medium"
                      >
                        No successful payments found yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

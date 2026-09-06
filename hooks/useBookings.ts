import { useQuery } from "@tanstack/react-query";
import { getMyBookingsAction } from "@/service/bookingActions";

export const useBookings = () => {
  return useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const data = await getMyBookingsAction();
      return data;
    },
  });
};

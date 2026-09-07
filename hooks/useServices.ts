import { fetchServicesAction } from "@/service/serviceActions";
import { useQuery } from "@tanstack/react-query";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const data = await fetchServicesAction();
      return data;
    },
  });
};

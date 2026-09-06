import { proxy } from "@/apiFetcher";
import { useQuery } from "@tanstack/react-query";

const fetchServices = async () => {
  const response = await proxy("/service");

  if (!response.ok) {
    throw new Error(response.data?.message || "Failed to fetch services");
  }
  return response.data?.data;
};

export const useServices = () => {
  return useQuery({
    queryKey: ["service"],
    queryFn: fetchServices,
  });
};

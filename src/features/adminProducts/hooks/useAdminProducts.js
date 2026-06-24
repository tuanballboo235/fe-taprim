import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "@/features/adminProducts/api/adminProductApi";

export const adminProductsQueryKey = ["adminProducts"];

export const useAdminProducts = (options = {}) => {
  return useQuery({
    queryKey: adminProductsQueryKey,
    queryFn: getAdminProducts,
    ...options,
  });
};

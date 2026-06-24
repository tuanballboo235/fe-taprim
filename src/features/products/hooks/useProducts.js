import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/api/productApi";

export const productsQueryKey = ["products"];

export const useProducts = (options = {}) => {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: getProducts,
    ...options,
  });
};

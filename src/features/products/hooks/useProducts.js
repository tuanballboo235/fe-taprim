import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducts } from "@/features/products/api/productApi";

export const productsQueryKey = ["products"];

export const useProducts = (keyword = "", options = {}) => {
  return useQuery({
    queryKey: [...productsQueryKey, keyword],
    queryFn: () => getProducts(keyword),
    placeholderData: keepPreviousData,
    ...options,
  });
};

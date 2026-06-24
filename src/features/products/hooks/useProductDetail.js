import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "@/features/products/api/productApi";

export const productDetailQueryKey = (productId) => [
  "products",
  "detail",
  String(productId),
];

export const useProductDetail = (productId, options = {}) => {
  return useQuery({
    queryKey: productDetailQueryKey(productId),
    queryFn: () => getProductDetail(productId),
    enabled: Boolean(productId),
    ...options,
  });
};

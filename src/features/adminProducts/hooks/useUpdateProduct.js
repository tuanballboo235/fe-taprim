import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/features/adminProducts/api/adminProductApi";
import { adminProductsQueryKey } from "@/features/adminProducts/hooks/useAdminProducts";
import { productsQueryKey } from "@/features/products/hooks/useProducts";

export const useUpdateProduct = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminProductsQueryKey });
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
      options.onSuccess?.(...args);
    },
    ...options,
  });
};

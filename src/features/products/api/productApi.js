import api from "@/shared/api/client";

export const getProducts = async () => {
  const response = await api.get("product/list-product-by-category");
  return response.data;
};

export const getProductDetail = async (productId) => {
  const response = await api.get(
    `product/list-product-option-by-productId/${productId}`
  );
  return response.data;
};

export const productApi = {
  getProducts,
  getProductDetail,
};

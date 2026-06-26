import api from "@/shared/api/client";

export const getProducts = async (keyword = "") => {
  const response = await api.get("product/list-product-by-category", {
    params: { keyword },
  });
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

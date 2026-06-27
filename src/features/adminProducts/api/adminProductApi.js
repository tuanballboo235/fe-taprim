import api from "@/shared/api/client";
import { getProducts } from "@/features/products/api/productApi";

const toFormData = (data = {}) => {
  if (data instanceof FormData) return data;

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });
  return formData;
};

export const getAdminProducts = getProducts;

export const getAdminProductDetail = async (productId) => {
  const response = await api.post(`product/get-product-details/${productId}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await api.post("product/create-product", toFormData(productData));
  return response.data;
};

export const updateProduct = async ({ productId, productData }) => {
  const response = await api.put(
    `product/update-product/${productId}`,
    toFormData(productData)
  );
  return response.data;
};

export const deleteProduct = async (productId) => {
  const response = await api.delete(`product/delete-product/${productId}`);
  return response.data;
};

export const approveProduct = (productId) => {
  const formData = new FormData();
  formData.append("Status", "1");
  return updateProduct({ productId, productData: formData });
};

export const hideProduct = (productId) => {
  const formData = new FormData();
  formData.append("Status", "0");
  return updateProduct({ productId, productData: formData });
};

export const adminProductApi = {
  getAdminProducts,
  getAdminProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  hideProduct,
};

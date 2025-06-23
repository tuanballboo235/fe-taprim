// src/services/api/productService.js
import api from './api'

 const getAllProducts = async () => {
  const response = await api.get('product/list-products')
  return response.data
}

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

export const createProduct = async (productData) => {
  const response = await api.post('product/create-product', productData)
  return response.data
}
// Có thể thêm create/update/delete nếu cần
export default getAllProducts;
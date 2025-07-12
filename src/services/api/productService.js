// src/services/api/productService.js
import api from './api'

export const getAllProducts = async () => {
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

export const getProductByCategory = async () => {
  const response = await api.get('product/list-product-by-category')
  return response.data
}

export const getProductOptionByProductId = async (productId) => {
  const response = await api.get(`/product/list-product-option-by-productId/${productId}`)
  return response.data
}


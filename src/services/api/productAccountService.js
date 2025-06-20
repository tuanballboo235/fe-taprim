// src/services/api/productService.js
import api from './api'

export const getProductAccountByTransactionCode = async ( transactionCode) => {
  const response = await api.post('ProductAccount/get-product-account-by-transaction-code', {
        transactionCode: String(transactionCode),
         })
  return response.data
}



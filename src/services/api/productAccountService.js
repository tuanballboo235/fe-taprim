// src/services/api/productService.js
import api from './api'

export const getProductAccountByTransactionCode = async ( transactionCode) => {
  const response = await api.post('ProductAccount/get-product-account-by-transaction-code', {
        transactionCode: String(transactionCode),
         })
  return response.data
}


export const addProductAccountToProduct = async ( productId, data) => {
  const response = await api.post(`/ProductAccount/add-product-account/${productId}`, {
      accountData: data.accountData,
        usernameProductAccount: data.usernameProductAccount,
        passwordProductAccount: data.passwordProductAccount,
        dateChangePass: data.dateChangePass,
        sellCount: parseInt(data.sellCount, 10),
        sellDateFrom: data.sellDateFrom,
        sellDateTo: data.sellDateTo,
        status: parseInt(data.status, 10),
         })
  return response.data
}
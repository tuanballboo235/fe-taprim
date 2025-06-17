// src/services/api/productService.js
import api from './api'

export const createQrPayment = async ( productId, totalAmount) => {
    // paymentData should contain necessary information for creating a QR payment
  const response = await api.post('Payment/generate-vietqr', {

        productId: String(productId),
        totalAmount: parseFloat(totalAmount),
       
  })
  return response.data
}
export const getPaymentFilter = async (transactionCode) => {
  const response = await api.post(`Payment/filter-payments?transactionCode=${transactionCode}`, {
    transactionCode: String(transactionCode),
  })
  return response.data
}


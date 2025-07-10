// src/services/api/productService.js
import api from './api'

export const createQrPayment = async ( productOptionId, totalAmount) => {
    // paymentData should contain necessary information for creating a QR payment
  const response = await api.post('Payment/generate-vietqr', {

        productOptionId: productOptionId,
        totalAmount: parseInt(totalAmount),
        
  })
  return response.data
}
export const getPaymentFilter = async (transactionCode) => {
  const response = await api.get(`Payment/filter-payments?TransactionCode=${encodeURIComponent(transactionCode)}`, {
    transactionCode: String(transactionCode),
  })
  return response.data
}


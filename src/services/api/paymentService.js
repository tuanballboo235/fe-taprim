// src/services/api/productService.js
import api from './api'

export const createQrPayment = async ( productId, totalAmount, emailOrder, clientNote) => {
    // paymentData should contain necessary information for creating a QR payment
  const response = await api.post('Payment/generate-vietqr', {
        productId: String(productId),
        totalAmount: totalAmount,
        emailOrder: emailOrder, // <-- thêm dòng này

        clientNote: String(clientNote)
  })
  return response.data
}

// Có thể thêm create/update/delete nếu cần

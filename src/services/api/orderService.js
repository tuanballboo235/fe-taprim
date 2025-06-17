import api from './api'

export const updateOrder = async (transactionCode, orderData) => {
  try {
    const response = await api.put(`Order/update-order/${transactionCode}`, {
      productAccountId: orderData.productAccountId,
      status: orderData.status,
      remainCode: orderData.remainCode,
      expiredAt: orderData.expiredAt,
      contactInfo: orderData.contactInfo,
      totalAmount: parseFloat(orderData.totalAmount)
    });
    console.error("cập nhật thành công:");

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    throw error;
  }
};

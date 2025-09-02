import api from './api'

export const updateOrder = async (transactionCode, orderData) => {
  try {
        const payload = {
      productAccountId: orderData.productAccountId,
      status: orderData.status,
      remainCode: orderData.remainCode,
      expiredAt: orderData.expiredAt,
      contactInfo: orderData.contactInfo,
      totalAmount: parseFloat(orderData.totalAmount)
    };

    console.log("Object gửi đi:", payload);
    const response = await api.put(`Order/update-order/${transactionCode}`,payload );

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    throw error;
  }
};

export const getOrderByTransactionCode = async (transactionCode) => {
  try {
    const response = await api.post(`Order/get-order-detail-by-transaction-code`, {
     transactionCode: transactionCode
    });
    console.error("Lấy thông tin đơn hàng thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đơn hàng:", error);
    throw error;
  }
};

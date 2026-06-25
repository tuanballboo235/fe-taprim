import api from "@/shared/api/client";

export const updateOrder = async (transactionCode, orderData) => {
  const payload = {
    productAccountId: orderData.productAccountId,
    status: orderData.status,
    remainCode: orderData.remainCode,
    expiredAt: orderData.expiredAt,
    contactInfo: orderData.contactInfo,
    totalAmount: parseFloat(orderData.totalAmount),
  };

  const response = await api.put(`Order/update-order/${transactionCode}`, payload);
  return response.data;
};

export const getOrderByTransactionCode = async (transactionCode) => {
  const response = await api.post("Order/get-order-detail-by-transaction-code", {
    transactionCode: String(transactionCode),
  });

  return response.data;
};

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

export const requestOrderLookupCode = async (transactionCode) => {
  const response = await api.post("Order/request-order-lookup-code", {
    transactionCode: String(transactionCode),
  });

  return response.data;
};

export const getOrderByTransactionCode = async (
  transactionCode,
  verificationCode
) => {
  const response = await api.post("Order/get-order-detail-by-transaction-code", {
    transactionCode: String(transactionCode),
    verificationCode: String(verificationCode),
  });

  return response.data;
};

export const getAdminProductOrders = async (filters = {}) => {
  const params = Object.entries(filters).reduce((current, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      current[key] = value;
    }

    return current;
  }, {});

  const response = await api.get("Order/admin/product-orders", { params });
  return response.data;
};

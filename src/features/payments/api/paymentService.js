import api from "@/shared/api/client";

export const createQrPayment = async ({
  productOptionId,
  totalAmount,
  transactionFee = 0,
  quantity,
  emailOrder,
  couponCode,
}) => {
  const response = await api.post("Payment/generate-vietqr", {
    productOptionId,
    totalAmount: parseInt(totalAmount, 10),
    transactionFee: parseInt(transactionFee, 10) || 0,
    quantity: Number.parseInt(quantity, 10) || 1,
    emailOrder,
    couponCode: couponCode || null,
  });
  return response.data;
};
export const getPaymentFilter = async (transactionCode) => {
  const response = await api.get(
    `Payment/filter-payments?TransactionCode=${encodeURIComponent(
      transactionCode
    )}`,
    {
      transactionCode: String(transactionCode),
    }
  );
  return response.data;
};

export const clearOrderAndPaymentTempByTransactionCode = async (
  transactionCode
) => {
  const response = await api.post(
    "Payment/clear-order-and-payment-temp-by-transaction-code",
    {
      transactionCode: String(transactionCode),
    }
  );
  return response.data;
};

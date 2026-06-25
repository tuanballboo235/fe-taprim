import api from "@/shared/api/client";

export const getProductAccountByTransactionCode = async (transactionCode) => {
  const response = await api.post(
    "ProductAccount/get-product-account-by-transaction-code",
    {
      transactionCode: String(transactionCode),
    }
  );
  return response.data;
};

export const addProductAccountToProduct = async (productOptionId, data) => {
  const accounts = Array.isArray(data) ? data : [data];
  const response = await api.post(
    `/ProductAccount/add-product-account/${productOptionId}`,
    accounts.map((account) => ({
      accountData: account.accountData,
      usernameProductAccount: account.usernameProductAccount,
      passwordProductAccount: account.passwordProductAccount,
      dateChangePass: account.dateChangePass || null,
      sellCount: Number.parseInt(account.sellCount, 10),
      sellDateFrom: account.sellDateFrom || null,
      sellDateTo: account.sellDateTo || null,
      status: Number.parseInt(account.status, 10),
    }))
  );
  return response.data;
};

export const getProductAccountFilter = async (object = {}) => {
  const response = await api.get("ProductAccount/get-product-account", {
    params: object,
  });
  return response.data;
};

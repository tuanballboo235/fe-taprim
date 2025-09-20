// src/services/api/productService.js
import api from "./api";

export const getNetflixUpdateFamily = async () => {
  const response = await api.get("TempMail/get-netflix-update-family");
  return response.data;
};
export const getEmailCodeNetflix = async (transactionCode) => {
  const response = await api.post("TempMail/get-netflix-code-sign-in", {
    transactionCode: String(transactionCode),
  });
  return response.data;
};

export const getEmailContentByEmailId = async (emailId) => {
  const response = await api.post("TempMail/get-mail-content", {
    emailId: String(emailId),
  });
  return response.data;
};

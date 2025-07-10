// src/services/api/productService.js
import api from "./api";

export const getCouponInfoByCouponCode = async (couponCode) => {
  // paymentData should contain necessary information for creating a QR payment
  const response = await api.post("Coupon/get-coupon-info-by-coupon-code", {
    couponCode: couponCode,
  });
  return response.data;
};
export const decreaseCouponUsage = async (couponCode) => {
  // paymentData should contain necessary information for creating a QR payment
  const response = await api.put(`Coupon/${couponCode}/decrease-turn`, {
    couponCode: couponCode,
  });
  return response.data;
};

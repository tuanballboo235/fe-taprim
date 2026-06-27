import api from "@/shared/api/client";

const cleanParams = (params = {}) =>
  Object.entries(params).reduce((current, [key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      current[key] = value;
    }

    return current;
  }, {});

export const getCoupons = async (filters = {}) => {
  const response = await api.get("Coupon", {
    params: cleanParams(filters),
  });
  return response.data;
};

export const createCoupon = async (couponData) => {
  const response = await api.post("Coupon", couponData);
  return response.data;
};

export const updateCoupon = async (couponId, couponData) => {
  const response = await api.put(`Coupon/${couponId}`, couponData);
  return response.data;
};

export const deleteCoupon = async (couponId) => {
  const response = await api.delete(`Coupon/${couponId}`);
  return response.data;
};

export const getCouponInfoByCouponCode = async (couponCode) => {
  const response = await api.post("Coupon/get-coupon-info-by-coupon-code", {
    couponCode,
  });
  return response.data;
};

export const decreaseCouponUsage = async (couponCode) => {
  const response = await api.put(`Coupon/${couponCode}/decrease-turn`, {
    couponCode,
  });
  return response.data;
};

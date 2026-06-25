const GENERIC_ERROR_MESSAGE =
  "Đã có lỗi xảy ra. Vui lòng liên hệ admin hoặc thử lại sau.";

const TECHNICAL_ERROR_PATTERNS = [
  /System\./i,
  /Exception/i,
  /Stack trace/i,
  /HEADERS\s*=+/i,
  /Microsoft\.AspNetCore/i,
  /ActivatorUtilities/i,
  /DeveloperExceptionPage/i,
  /\bat\s+[\w.<>]+\(.*\)/i,
  /<!doctype html/i,
  /<html/i,
];

const isTechnicalMessage = (message = "") => {
  const normalized = String(message).trim();

  return (
    normalized.length > 500 ||
    TECHNICAL_ERROR_PATTERNS.some((pattern) => pattern.test(normalized))
  );
};

const getValidationMessage = (errors) => {
  if (!errors || typeof errors !== "object") return null;

  const values = Object.values(errors).flat();
  const firstMessage = values.find((value) => typeof value === "string");

  return firstMessage ?? null;
};

const getSafeMessage = (message, fallback) => {
  if (!message) return fallback;

  const normalized = String(message).trim();

  if (!normalized || isTechnicalMessage(normalized)) {
    return fallback;
  }

  return normalized;
};

export const getApiErrorMessage = (error, fallback = GENERIC_ERROR_MESSAGE) => {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const safeFallback = fallback || GENERIC_ERROR_MESSAGE;

  if (status >= 500) {
    return GENERIC_ERROR_MESSAGE;
  }

  if (typeof data === "string") {
    return getSafeMessage(data, safeFallback);
  }

  const message =
    data?.message ||
    data?.Message ||
    getValidationMessage(data?.errors) ||
    data?.title ||
    error?.message;

  return getSafeMessage(message, safeFallback);
};

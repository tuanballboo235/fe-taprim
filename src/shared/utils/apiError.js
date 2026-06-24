export const getApiErrorMessage = (
  error,
  fallback = "Da co loi xay ra. Vui long thu lai."
) => {
  const data = error?.response?.data;

  if (typeof data === "string") return data;

  return (
    data?.message ||
    data?.Message ||
    data?.errors?.message ||
    data?.title ||
    error?.message ||
    fallback
  );
};

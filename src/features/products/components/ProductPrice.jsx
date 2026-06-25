export default function ProductPrice({
  minPrice,
  maxPrice,
  price,
  fallback = "Liên hệ",
  className = "",
}) {
  const formatPrice = (value) =>
    value == null ? null : `${Number(value).toLocaleString("de-DE")}d`;

  if (price != null) {
    return <span className={className}>{formatPrice(price)}</span>;
  }

  if (minPrice != null && maxPrice != null) {
    return (
      <span className={className}>
        {formatPrice(minPrice)} - {formatPrice(maxPrice)}
      </span>
    );
  }

  return <span className={className}>{fallback}</span>;
}

export default function ProductDetailCard({
  title,
  description,
  price,
  salePrice,
  quantity,
  isSale,
}) {
  const displayPrice = salePrice ?? price;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        {isSale && (
          <span className="mt-2 inline-block rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
            SALE
          </span>
        )}
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
        {description}
      </p>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded border border-slate-200 p-3">
          <div className="text-slate-500">Giá</div>
          <div className="font-semibold text-slate-800">
            {Number(displayPrice || 0).toLocaleString("de-DE")}đ
          </div>
        </div>
        <div className="rounded border border-slate-200 p-3">
          <div className="text-slate-500">Số lượng</div>
          <div className="font-semibold text-slate-800">{quantity}</div>
        </div>
      </div>
    </div>
  );
}

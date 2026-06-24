import { FaStore } from "react-icons/fa";

const ProductSidebar = ({ products = [], onSelect, selectedProductId, productInfo }) => {
  const options = Array.isArray(products)
    ? products
    : products?.productOptions ?? products?.data?.productOptions ?? [];

  const productName = productInfo || "Danh sach goi";

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:w-80 lg:shrink-0">
      <div className="mb-4 flex items-start gap-3">
        <span className="mt-0.5 rounded-md bg-blue-50 p-2 text-blue-600">
          <FaStore />
        </span>
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-slate-900">
            {productName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Chon goi de xem danh sach account.
          </p>
        </div>
      </div>

      <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1 lg:max-h-[calc(100vh-220px)]">
        {options.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            Khong co goi san pham
          </div>
        ) : (
          options.map((product, index) => {
            const optionId = product.productOptionId ?? product.id;
            const isSelected = optionId === selectedProductId;

            return (
              <button
                key={optionId || index}
                type="button"
                onClick={() => onSelect?.(product)}
                className={`w-full rounded-md border p-3 text-left transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 text-blue-800"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="min-w-0 flex-1 text-sm font-semibold">
                    {product.label || product.name || "Goi khong co ten"}
                  </span>
                  {typeof product.stockAccount === "number" && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        product.stockAccount > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.stockAccount}
                    </span>
                  )}
                </div>

                {typeof product.sellCount === "number" && (
                  <p className="mt-2 text-xs text-slate-500">
                    Da ban: {product.sellCount}
                  </p>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default ProductSidebar;

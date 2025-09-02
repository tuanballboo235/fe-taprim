import React from "react";
import { FaStore } from "react-icons/fa";
import clsx from "clsx";

const ProductSidebar = ({ products, onSelect, selectedProductId,productInfo}) => {
  // Chuẩn hóa dữ liệu đầu vào
  // - Nếu truyền mảng => dùng luôn
  // - Nếu truyền object có field productOptions => dùng field đó
  // - Nếu truyền response JSON như ví dụ => lấy products.data.productOptions
  const options = Array.isArray(products)
    ? products
    : products?.productOptions ??
      products?.data?.productOptions ??
      [];

  const productName =
   productInfo??
    "Danh sách sản phẩm";

  return (
    <aside className="w-full md:w-1/4 xl:w-1/6 bg-white p-4 border-r shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaStore className="text-blue-500" /> {productName}
      </h2>

      <ul className="space-y-2">
        {options.length === 0 ? (
          <li className="text-gray-400 italic">Không có sản phẩm</li>
        ) : (
          options.map((product, index) => {
            const isSelected =
              product.productOptionId === selectedProductId ||
              product.id === selectedProductId;

            return (
              <li
                key={product.productOptionId || product.id || index}
                onClick={() => onSelect?.(product)}
                className={clsx(
                  "p-3 rounded-lg border cursor-pointer transition-all",
                  isSelected
                    ? "bg-blue-100 border-blue-400 text-blue-700 font-semibold"
                    : "hover:bg-gray-50 border-gray-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <span>{product.label || product.name || "Sản phẩm không có tên"}</span>
                 {typeof product.stockAccount === "number" && (
  <span
    className={clsx(
      "text-xs px-2 py-0.5 rounded-full",
      product.stockAccount > 0
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-600"
    )}
  >
    <div>
      <p>{product.stockAccount} tài khoản</p>
      {typeof product.sellCount === "number" && product.sellCount >= 1 && (
        <p>{product.sellCount} lượt bán</p>
      )}
    </div>
  </span>
)}
                </div>
              </li>
            );
          })
        )}
      </ul>
    </aside>
  );
};

ProductSidebar.defaultProps = {
  products: [], // cho phép truyền mảng options trực tiếp
  onSelect: undefined,
  selectedProductId: undefined,
};

export default ProductSidebar;

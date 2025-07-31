import React from "react";
import { FaStore } from "react-icons/fa";

const ProductSidebar = ({ products = [], onSelect, selectedProductId }) => {
  return (
    <aside className="w-full md:w-1/3 xl:w-1/4 bg-white p-4 border-r shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaStore className="text-blue-500" /> Danh sách sản phẩm
      </h2>
      <ul className="space-y-2">
        {products.length === 0 ? (
          <li className="text-gray-400 italic">Không có sản phẩm</li>
        ) : (
          products.map((product) => (
            <li
              key={product.id}
              onClick={() => onSelect?.(product)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                product.productOptionId === selectedProductId
                  ? "bg-blue-100 border-blue-400 text-blue-700 font-semibold"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              {product.label || product.name || "Sản phẩm không tên"}
            </li>
          ))
        )}
      </ul>
    </aside>
  );
};

export default ProductSidebar;

import React from "react";
import { Link } from "react-router-dom";

const CategorySection = ({ title, description, products }) => {
  console.log("Products data:", products);

  return (
    <section className="mb-20 px-4">
      <div className="border-b pb-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        {description && (
          <p className="text-base text-gray-500 mt-1">{description}</p>
        )}
      </div>

      {/* 5 card / hàng ở màn lớn */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => {
          const isOutOfStock = product.canSell < 1;
          const imageFallback =
            "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg";
          const baseUrl = "http://103.238.235.227/"; // đổi sang domain thật khi deploy

          return (
            <Link
              key={product.id}
              to={isOutOfStock ? "#" : `/product/${product.id}`}
              className={`relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-200 border ${
                isOutOfStock ? "pointer-events-none opacity-70" : ""
              }`}
            >
              {/* Image Section: giữ nguyên layout, KHÔNG cắt ảnh */}
              <div className="relative bg-gray-50 h-48 flex items-center justify-center">
                <img
                  src={product.image ? `${baseUrl}${product.image}` : imageFallback}
                  alt={product.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = imageFallback;
                  }}
                />

                {/* Out of stock overlay */}
                {isOutOfStock && (
                  <>
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10" />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[11px] px-2 py-[2px] rounded shadow z-20">
                      Hết hàng
                    </div>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="text-[15px] font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-red-600 font-semibold">
                    {product.minPrice != null && product.maxPrice != null
                      ? `${product.minPrice.toLocaleString()}đ - ${product.maxPrice.toLocaleString()}đ`
                      : "Liên hệ"}
                  </span>
                  {product.discount && (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-[2px] rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;

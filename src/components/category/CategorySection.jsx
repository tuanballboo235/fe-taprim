import React from "react";
import { Link } from "react-router-dom";

const CategorySection = ({ title, description, products }) => {
  return (
    <section className="mb-20 px-4">
      <div className="border-b pb-6 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        {description && (
          <p className="text-base text-gray-500 mt-1">{description}</p>
        )}
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => {
          const isOutOfStock = !product.inStock;
          const imageFallback = "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg";

          return (
            <Link
              key={product.id}
              to={isOutOfStock ? "#" : `/product/${product.id}`}
              className={`relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-200 border ${
                isOutOfStock ? "pointer-events-none opacity-70" : ""
              }`}
            >
              {/* Image Section */}
              <div className="relative">
                <img
                  src={product.image || imageFallback}
                  alt={product.name}
                  className="w-full h-48 object-cover"
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

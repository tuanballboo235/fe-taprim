import React from 'react';
import { Link } from 'react-router-dom';

const CategorySection = ({ title, description, products, viewAllLink }) => {
  return (
    <section className="mb-24 px-2">
      <hr />

      {/* Header */}
      <div className="flex justify-between items-end pt-10 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            Khám phá
          </Link>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const isOutOfStock = !product.inStock;

          return (
            <div
              key={product.id}
              className="relative bg-white rounded-xl overflow-hidden shadow hover:shadow-xl transition min-w-[240px]"
            >
              
              {/* Product Image */}
              <div className="relative z-0" >{/* Overlay khi hết hàng */}
              {isOutOfStock && (
                    <div className="absolute inset-0 bg-white/60 opacity-100 z-10"></div>
              )}

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />

                {/* Out of stock badge */}
                {isOutOfStock && (
                  <div className="absolute top-2 left-2 bg-black text-white text-[11px] px-2 py-[3px] rounded-md shadow-md z-20">
                    Hết hàng
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 z-0 relative">
                <p className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[40px]">
                  {product.name}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm text-red-600 font-semibold">
                    {product.salePrice.toLocaleString()} đ
                  </span>
                  {product.discount && (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {product.originalPrice && (
                  <div className="text-xs text-gray-400 line-through mt-1">
                    {product.originalPrice.toLocaleString()} đ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;

import React from "react";
import { Link } from "react-router-dom";
import { HOSTADDRESS } from "../../utils/apiEndpoint.js";
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
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4">
        {products
          .filter((product) => product.status === 1)
          .map((product) => {
            const isOutOfStock = product.canSell < 1;
            const imageFallback =
              "/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg";
            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="relative bg-white"
              >
                {/* Image Section: giữ nguyên layout, KHÔNG cắt ảnh */}
                <div className="relative  bg-gray-50 h-36">
                  <img
                    src={
                      product.image
                        ? `${HOSTADDRESS}${product.image}`
                        : imageFallback
                    }
                    alt={product.name}
                    loading="lazy"
                    className="max-h-full max-w-full rounded-md object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = imageFallback;
                    }}
                  />

                  {/* Out of stock overlay */}
                  {isOutOfStock && (
                    <>
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[0px] z-10" />
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-[11px] px-2 py-[2px] rounded shadow z-20">
                        Hết hàng
                      </div>
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="p-1">
                  <h3 className="text-[15px] font-normal text-gray-900 line-clamp-2 min-h-[20px] hover:underline cursor-pointer">
                    {product.name}
                  </h3>

                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[13px] text-black font-semibold">
                      {product.minPrice != null && product.maxPrice != null
                        ? `${product.minPrice.toLocaleString(
                            "de-DE"
                          )}đ - ${product.maxPrice.toLocaleString("de-DE")}đ`
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

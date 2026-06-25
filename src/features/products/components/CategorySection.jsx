import { Link } from "react-router-dom";
import { getAssetUrl } from "@/shared/utils/apiEndpoint";
import ProductPrice from "@/features/products/components/ProductPrice";

const imageFallback =
  "https://res.cloudinary.com/dzcb8xqjh/image/upload/v1750269205/logo_crop_xlfxai.png";

const CategorySection = ({ title, description, products = [] }) => {
  const visibleProducts = products.filter((product) => product.status === 1);

  if (visibleProducts.length === 0) return null;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>
        <span className="text-sm font-medium text-slate-500">
          {visibleProducts.length} sản phẩm
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product) => {
          const isOutOfStock = (product.canSell ?? 0) < 1;

          return (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group flex min-h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-green-500 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] bg-slate-50">
                <img
                  src={
                    product.image ? getAssetUrl(product.image) : imageFallback
                  }
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = imageFallback;
                  }}
                />

                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-start justify-start bg-white/60 p-3">
                    <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow">
                      Hết hàng
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <h3 className="line-clamp-2 min-h-[44px] text-sm font-semibold leading-5 text-slate-900 group-hover:text-green-700">
                  {product.name}
                </h3>

                <div className="mt-auto flex items-center justify-between gap-3">
                  <ProductPrice
                    minPrice={product.minPrice}
                    maxPrice={product.maxPrice}
                    fallback="Liên hệ"
                    className="text-sm font-bold text-green-700"
                  />
                  {product.discount && (
                    <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
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

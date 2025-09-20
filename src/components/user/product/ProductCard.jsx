import React, { useState } from "react";
import PaymentModal from "../../payment/PaymentModal";
import OrderAccount from "../../order/OrderAccount";
import ContactCard from "../../contact/ContactCard";
import ProductDetailCard from "./ProductDetail";
function ProductCard({
  productId,
  image,
  title,
  price,
  salePrice,
  isSale = false,
  quantity,
  onOrder,
}) {
  const hasDiscount = salePrice !== undefined && salePrice < price;
  const isOutOfStock = quantity === 0;

  const [showPayment, setShowPayment] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [showProductCarDetails, setShowProductCarDetails] = useState(false);
  const handleSuccess = (order) => {
    setOrderResult(order);
    setShowPayment(false);
    setShowProductCarDetails(false);
    setShowContact(false);
  };

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-[220px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {isSale && (
            <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded shadow-sm">
              SALE
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute top-3 right-3 bg-zinc-400 text-white text-xs px-2 py-1 rounded shadow-sm">
              Hết hàng
            </span>
          )}
        </div>

        <div className="p-4 flex flex-col justify-between flex-1 gap-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-col flex-1">
              <h3 className="text-base font-medium text-slate-800 hover:text-blue-600 transition line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Số lượng:{" "}
                <span
                  className={`font-semibold ${
                    isOutOfStock ? "text-red-600" : "text-slate-800"
                  }`}
                >
                  {quantity}
                </span>
              </p>
            </div>

            <div className="text-right min-w-[100px]">
              {hasDiscount ? (
                <>
                  <p className="text-xs text-slate-400 line-through"></p>
                  <p className="text-lg font-semibold text-purple-600"></p>
                </>
              ) : (
                <p className="text-lg font-semibold text-slate-800"></p>
              )}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setShowProductCarDetails(true)}
              className="text-sm px-4 py-2 rounded-md font-medium bg-indigo-100 hover:bg-indigo-200 text-slate-800 transition"
            >
              Chi tiết
            </button>

            <button
              onClick={() => {
                setShowContact(true);
                onOrder?.();
              }}
              className="text-sm px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-black font-medium transition"
            >
              Liên hệ
            </button>

            <button
              onClick={() => setShowPayment(true)}
              disabled={isOutOfStock}
              className={`text-sm px-4 py-2 rounded-md font-medium transition ${
                isOutOfStock
                  ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white"
              }`}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>

      {isOutOfStock && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
          Sản phẩm đã hết
        </div>
      )}

      {orderResult && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl max-w-lg w-full shadow-xl">
            <OrderAccount order={orderResult} />
            <button
              onClick={() => setOrderResult(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {showPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl max-w-2xl w-full shadow-xl">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
            <PaymentModal
              onClose={() => setShowPayment(false)}
              onSuccess={handleSuccess}
              productId={productId}
              productName={title}
              amount={price}
              fee={500}
              total={(hasDiscount ? salePrice : price) + 500}
              quantity={quantity}
            />
          </div>
        </div>
      )}

      {showContact && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <button
              onClick={() => setShowContact(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
            <ContactCard
              facebookUrl="https://www.facebook.com/taprim.vn"
              zaloUrl="https://zalo.me/taprim"
              phoneNumber="0934 567 890"
              fbGroupUrl="https://www.facebook.com/groups/taprim.vn"
            />
          </div>
        </div>
      )}

      {showProductCarDetails && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl max-w-4xl w-full shadow-xl">
            <button
              onClick={() => setShowProductCarDetails(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
            <ProductDetailCard
              title={title}
              description="Mô tả chi tiết sản phẩm sẽ được cập nhật sau."
              price={price}
              salePrice={salePrice}
              quantity={quantity}
              isSale={isSale}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;

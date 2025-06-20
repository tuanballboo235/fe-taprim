import React, { useState } from "react";
import PaymentModal from "../payment/PaymentModal";
import OrderAccount from "../order/OrderAccount";

function ProductCard({
  productId,
  image,
  title,
  price,
  salePrice,
  isSale = false,
  quantity = 1,
  onViewDetail,
  onCheckout,
  onOrder,
}) {
  const hasDiscount = salePrice !== undefined && salePrice < price;
  const isOutOfStock = quantity === 0;

  const [showPayment, setShowPayment] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const handleSuccess = (order) => {
    setOrderResult(order);
    setShowPayment(false);
  };

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-[220px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isSale && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded shadow-md">
              SALE
            </span>
          )}
          {isOutOfStock && (
            <span className="absolute top-3 right-3 bg-gray-600 text-white text-xs px-3 py-1 rounded shadow-md">
              Hết hàng
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col justify-between flex-1 gap-3">
          {/* ==== Thông tin sản phẩm gom gọn lại ==== */}
          <div className="flex justify-between items-start gap-4">
            {/* Tiêu đề và số lượng */}
            <div className="flex flex-col flex-1">
              <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Số lượng:{" "}
                <span className={`font-semibold ${isOutOfStock ? "text-red-600" : "text-gray-800"}`}>
                  {quantity}
                </span>
              </p>
            </div>

            {/* Giá */}
            <div className="text-right min-w-[100px]">
              {hasDiscount ? (
                <>
                  <p className="text-xs text-gray-400 line-through">
                    {price.toLocaleString("vi-VN")}₫
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {salePrice.toLocaleString("vi-VN")}₫
                  </p>
                </>
              ) : (
                <p className="text-lg font-bold text-gray-800">
                  {price.toLocaleString("vi-VN")}₫
                </p>
              )}
            </div>
          </div>

          {/* ==== Nút thao tác ==== */}
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={onViewDetail}
              className="text-sm px-4 py-2 rounded-lg border border-gray-700 text-gray-700 hover:bg-gray-800 hover:text-white transition"
            >
              Xem chi tiết
            </button>

            <button
              onClick={() => onOrder?.()}
              disabled={isOutOfStock}
              className={`text-sm px-4 py-2 rounded-lg transition font-medium ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              }`}
            >
              Đặt hàng
            </button>

            <button
              onClick={() => {
                setShowPayment(true);
                onCheckout?.();
              }}
              disabled={isOutOfStock}
              className={`text-sm px-4 py-2 rounded-lg transition font-medium ${
                isOutOfStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
  {/* Tooltip khi hết hàng */}
  {isOutOfStock && (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 rounded bg-black text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
      Sản phẩm đã hết
    </div>
  )}
      {/* Kết quả thanh toán */}
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

      {/* Modal thanh toán */}
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
    </>
  );
}

export default ProductCard;

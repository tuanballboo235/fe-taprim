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
  onViewDetail,
  onCheckout,
}) {
  const hasDiscount = salePrice !== undefined && salePrice < price;
  const [showPayment, setShowPayment] = useState(false);
  const [orderResult, setOrderResult] = useState(null); // ✅ thêm state mới

  const handleSuccess = (order) => {
    setOrderResult(order);
    setShowPayment(false);
  };

  return (
    <>
      <div className="group relative bg-white border rounded-xl shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col">
        {isSale && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
            Sale
          </span>
        )}

        <div className="relative w-full h-[200px] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="p-4 flex flex-col justify-between flex-1">
          <h3
            title={title}
            className="text-lg from-neutral-20 text-gray-900 leading-tight line-clamp-2 hover:text-blue-600 transition-colors duration-150"
          >
            {title}
          </h3>

          <div className="mt-2 flex flex-col items-start">
            {hasDiscount ? (
              <>
                <span className="text-sm text-gray-400 line-through">
                  {price.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-xl font-bold text-red-600">
                  {salePrice.toLocaleString("vi-VN")}₫
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-gray-800">
                {price.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>

          <div className="mt-4 flex justify-between gap-2">
            <button
              onClick={onViewDetail}
              className="flex-1 text-sm px-4 py-2 rounded-md border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition"
            >
              Xem chi tiết
            </button>
            <button
              onClick={() => {
                setShowPayment(true);
                if (onCheckout) onCheckout();
              }}
              className="flex-1 text-sm px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition"
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* Hiện kết quả thanh toán nếu có */}
      {orderResult && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-xl max-w-lg w-full shadow-lg">
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
          <div className="relative bg-white p-6 rounded-xl max-w-2xl w-full shadow-lg">
            <button
              onClick={() => setShowPayment(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
            <PaymentModal
              onClose={() => setShowPayment(false)}
              onSuccess={handleSuccess} // ✅ truyền callback
              productId={productId}
              productName={title}
              amount={price}
              fee={500}
              total={(hasDiscount ? salePrice : price) + 500}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;

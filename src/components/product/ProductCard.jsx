import React,{ useState } from "react";
import PaymentModal from "../payment/PaymentModal";
function ProductCard({
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

  return (
    <>
  
    <div className="relative bg-white shadow rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-200">
      {/* Sale badge */}
      {isSale && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          Sale!
        </div>
      )}

      {/* Image */}
      <img src={image} alt={title} className="w-full h-[180px] object-cover" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 min-h-[40px]">
          {title}
        </h3>

        {/* Rating 
        {rating && (
          <div className="flex items-center gap-1 text-yellow-500 text-sm">
            {"★".repeat(Math.floor(rating))}
            <span className="text-gray-500 ml-1 text-xs">({rating})</span>
          </div>
        )}
        */}

        {/* Price */}
        <div className="flex gap-2 items-center">
          {hasDiscount ? (
            <>
              <span className="text-sm line-through text-gray-400">
                {price.toLocaleString()} ₫
              </span>
              <span className="text-sm font-bold text-red-500">
                {salePrice.toLocaleString()} ₫
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-gray-800">
              {price.toLocaleString()} ₫
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex justify-between gap-2">
          <button
            onClick={onViewDetail}
            className="flex-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white text-sm px-4 py-2 rounded-md transition"
          >
            Xem chi tiết
          </button>
          <button 
            onClick={() => {
              setShowPayment(true);
              if (onCheckout) onCheckout();
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition"
          >
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
    {showPayment && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="relative bg-white p-6 rounded-xl max-w-2xl w-full">
      <button
        onClick={() => setShowPayment(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl font-bold"
      >
        ×
      </button>
      <PaymentModal
        productName={title}
        amount={price }
        fee={500}
        total={(hasDiscount ? salePrice : price) + 500}
        qrImageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTOFQu7p46XsbV39CIHYl3swUPQfDc7HGoP6FrVBIK9rPnaAw68GgDZrbVqAtA-HfGcz4&usqp=CAU"
      />
    </div>
  </div>
)}

      </>
  );
}
export default ProductCard;

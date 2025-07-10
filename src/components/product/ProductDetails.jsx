import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductOptionByProductId } from "../../services/api/productService";
import PaymentModal from "../../components/payment/PaymentModal.jsx";
import { toast } from 'react-toastify';
import { decreaseCouponUsage } from "../../services/api/couponService";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [entryPrice, setEntryPrice] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [entryStockAccount, setEntryStockAccount] = useState(0);

  const [showPayment, setShowPayment] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [fetchdata, setFetchData] = useState(null);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductOptionByProductId(id);
        setFetchData(data.data);

        const available = data.data.productOptions.find(
          (opt) => opt.stockAccount > 0
        );
        if (available) {
          setSelectedOption(available.productOptionId);
          setEntryPrice(available.price);
          setEntryStockAccount(available.stockAccount);
        }
        console.log("Thông tin sản phẩm:", fetchdata);
      } catch (error) {
        toast.error("❌ Lỗi khi tải thông tin sản phẩm",{ toastId: "load-error" });
      }
    };

    fetchProduct();
  }, [id]);

  const handlePaymentSuccess =async  (order) => {
    setOrderResult(order); // bạn có thể dùng sau để hiển thị kết quả
    setShowPayment(false);
    
  if (order.couponCode) {
    try {
      await decreaseCouponUsage(order.couponCode);
      console.log("✅ Giảm lượt coupon thành công");
    } catch (error) {
      console.error("❌ Lỗi giảm lượt coupon:", error);
    }
  }
  };

  //Hiển thị thông báo loading
  if (!fetchdata) {
    return (
      <div className="text-center py-10">Đang tải dữ liệu sản phẩm...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-xl shadow-md border border-gray-200">
      {/* Left - Image */}
      <div className="flex flex-col items-center">
        <img
          src="/src/assets/images/483967539_2068210710352289_1535954025462080168_n.jpg"
          className="rounded-lg w-full object-contain max-h-64"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default.jpg";
          }}
        />
        <button className="text-teal-600 text-sm mt-2 hover:underline">
          Xem thêm ảnh
        </button>
      </div>

      {/* Right - Info */}
      <div className="space-y-5">
        <p className="text-xs uppercase text-gray-400 font-semibold tracking-wide">
          Sản phẩm
        </p>
        <h1 className="text-3xl font-extrabold text-gray-800">
          {fetchdata.productName}
        </h1>

        <p className="text-sm text-gray-700">
          Kho hàng:
          <span
            className={`ml-1 font-semibold ${
              fetchdata.productOptions.some((opt) => opt.stockAccount > 0)
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
           {entryStockAccount > 0 ? `${entryStockAccount} sản phẩm` : "Hết hàng"}
          </span>
        </p>

        <div className="text-sm text-gray-600">
          <p>
            Thể loại:{" "}
            <span className="font-semibold">{fetchdata.categoryName}</span>
          </p>
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="text-2xl font-bold text-teal-600">
            {entryPrice.toLocaleString()}đ
          </div>
        </div>

        {/* Duration buttons */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-1">
            Chọn thời hạn
          </p>
          <div className="flex flex-wrap gap-2">
            {fetchdata.productOptions.map((option) => (
              <button
                key={option.productOptionId}
                className={`px-3 py-1 border text-sm rounded-md transition ${
                  selectedOption === option.productOptionId
                    ? "bg-blue-100 border-blue-500"
                    : "border-gray-300"
                } ${
                  option.stockAccount === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-50"
                }`}
                onClick={() => {
                  if (option.stockAccount > 0) {
                    setSelectedOption(option.productOptionId);
                    setEntryPrice(option.price);
                    setEntryStockAccount(option.stockAccount);
                  }
                }}
                disabled={option.stockAccount === 0}
              >
                {option.label} - {option.price.toLocaleString()}đ
                {option.stockAccount === 0 && (
                  <span className="ml-1 text-red-500 text-xs">(Hết hàng)</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Email input */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Nhập thông tin bổ sung
          </label>
          <input
            type="email"
            placeholder="Email khách hàng"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowPayment(true)}
            className="bg-teal-600 text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-teal-700 w-full"
          >
            📥 Mua ngay
          </button>

          <button className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-200 w-full">
            📞 Liên hệ shop
          </button>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="md:col-span-2 mt-8 bg-orange-50 text-sm text-gray-800 rounded-lg p-4 border border-orange-200">
        <p className="font-semibold text-orange-700 mb-2">📌 Lưu ý:</p>
        <pre className="whitespace-pre-wrap leading-relaxed">
          {fetchdata.description}
        </pre>
      </div>
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
        productOptionId={selectedOption}
        productName={fetchdata.productName}
        amount={entryPrice}
        fee={500}
        total={entryPrice + 500}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  </div>
)}

    </div>
  );
};

export default ProductDetailPage;

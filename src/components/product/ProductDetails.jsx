import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductOptionByProductId } from "../../services/api/productService";
import PaymentModal from "../../components/payment/PaymentModal.jsx";
import { toast } from "react-toastify";
import { decreaseCouponUsage } from "../../services/api/couponService";
import { FANPAGE_URL } from "../../utils/constant/Contact.js";
import { CubeIcon, TagIcon } from "@heroicons/react/24/solid";
import { HOSTADDRESS } from "../../utils/apiEndpoint.js";
const ProductDetailPage = () => {
  const { id } = useParams();
  const [entryPrice, setEntryPrice] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [entrySellCount, setEntrySellCount] = useState(0);

  const [showPayment, setShowPayment] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [fetchdata, setFetchData] = useState(null);

  // email state
  const [email, setEmail] = useState("");
  // đặt gần các state khác
  const [displayImage, setDisplayImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductOptionByProductId(id);
        setFetchData(data.data);

        // chọn option còn lượt bán
        const available = data.data.productOptions.find(
          (opt) => (opt.sellCount ?? 0) > 0
        );
        if (available) {
          setSelectedOption(available.productOptionId);
          setEntryPrice(available.price ?? 0);
          setEntrySellCount(available.sellCount ?? 0);
          setDisplayImage(
            available.productOptionImage ?? "/images/default.jpg"
          );
        }
      } catch (error) {
        toast.error("❌ Lỗi khi tải thông tin sản phẩm", {
          toastId: "load-error",
        });
      }
    };

    fetchProduct();
  }, [id]);

  const handlePaymentSuccess = async (order) => {
    setOrderResult(order);
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

  // validate email cơ bản
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  if (!fetchdata) {
    return (
      <div className="text-center py-10">Đang tải dữ liệu sản phẩm...</div>
    );
  }

  const hasAnySellLeft = fetchdata.productOptions.some(
    (opt) => (opt.sellCount ?? 0) > 0
  );

  return (
    <div className="max-w-6xl mt-6  mb-10 mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-md border border-gray-100 font-sans">
      {/* Left - Image */}
      <div className="flex flex-col items-center space-y-4">
        <img
          src={`${HOSTADDRESS}${displayImage}`}
          alt={fetchdata?.productName || "Ảnh sản phẩm"}
          className="rounded-xl w-full max-h-72 object-contain bg-gray-50 p-2 border border-gray-100"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/default.jpg";
          }}
        />
      </div>

      {/* Right - Info */}
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs uppercase text-gray-400 font-semibold tracking-wide">
            Sản phẩm
          </p>
          <h1 className="text-2xl font-semibold text-gray-800 leading-snug">
            {fetchdata.productName}
          </h1>
        </div>

        <div className="space-y-2 text-sm">
          {/* Kho hàng */}
          <p className="text-gray-700 flex items-center">
            <CubeIcon
              className={`w-4 h-4 mr-1 ${
                hasAnySellLeft ? "text-green-500" : "text-red-500"
              }`}
            />
            Kho hàng:
            <span
              className={`ml-1 font-semibold ${
                hasAnySellLeft ? "text-green-600" : "text-red-600"
              }`}
            >
              {entrySellCount > 0 ? `${entrySellCount}` : "Hết hàng"}
            </span>
          </p>

          {/* Thể loại */}
          <p className="text-gray-700 flex items-center">
            <TagIcon className="w-4 h-4 mr-1 text-gray-500" />
            Thể loại:
            <span className="ml-1 font-semibold">{fetchdata.categoryName}</span>
          </p>
        </div>

        {/* Pricing */}
        <div className="space-y-1">
          <div className="text-2xl font-bold text-teal-600 tracking-tight">
            {Number(entryPrice || 0).toLocaleString("de-DE")}đ
          </div>
        </div>

        {/* Duration buttons */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Chọn thời hạn</p>
          <div className="flex flex-wrap gap-3">
            {fetchdata.productOptions.map((option) => {
              const optionSellLeft = option.sellCount ?? 0;
              const isDisabled = optionSellLeft === 0;

              return (
                <button
                  key={option.productOptionId}
                  className={[
                    "px-4 py-2 text-sm rounded-lg transition border font-medium",
                    selectedOption === option.productOptionId
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "border-gray-300 text-gray-700 hover:bg-blue-50",
                    isDisabled
                      ? "opacity-50 cursor-not-allowed hover:bg-white"
                      : "",
                  ].join(" ")}
                  onClick={() => {
                    if (!isDisabled) {
                      setSelectedOption(option.productOptionId);
                      setEntryPrice(option.price ?? 0);
                      setEntrySellCount(optionSellLeft);
                      setDisplayImage(
                        option.productOptionImage ?? "/images/default.jpg"
                      );
                    }
                  }}
                  disabled={isDisabled}
                >
                  {option.label} - {(option.price ?? 0).toLocaleString("de-DE")}
                  đ
                  {isDisabled && (
                    <span className="ml-1 text-red-500 text-xs">
                      (Hết hàng)
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email input */}
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-800 block mb-2">
            📧 Email khách hàng <span className="text-red-600">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Email này sẽ được sử dụng để gửi thông tin hóa đơn, bảo hành và các
            thông báo liên quan. Liên hệ ngay fanpage trong trường hợp cần hỗ
            trợ.
          </p>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email khách hàng..."
              className="w-full border border-teal-400 rounded pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400"
              required
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              if (!email) {
                toast.error("Vui lòng nhập email trước khi mua hàng");
                return;
              }
              if (!validateEmail(email)) {
                toast.error("Email không hợp lệ, vui lòng kiểm tra lại");
                return;
              }
              setShowPayment(true);
            }}
            className="bg-teal-600 text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-teal-700 w-full"
          >
            Mua ngay
          </button>

          <a
            href={FANPAGE_URL}
            className="bg-gray-100 text-center text-gray-800 px-6 py-2 rounded-md font-medium text-sm hover:bg-gray-200 w-full"
          >
            Liên hệ shop
          </a>
        </div>
      </div>

      {/* Ghi chú */}
      {fetchdata.description && (
        <div className="md:col-span-2 mt-8 bg-orange-50 text-sm text-gray-800 rounded-lg p-4 border border-orange-200">
          <p className="font-semibold text-orange-700 mb-2">📌 Lưu ý:</p>
          <pre className="whitespace-pre-wrap leading-relaxed">
            {fetchdata.description}
          </pre>
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
              productOptionId={selectedOption}
              productName={fetchdata.productName}
              amount={entryPrice}
              fee={500}
              customerEmail={email}
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

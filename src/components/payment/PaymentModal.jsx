import React, { useState, useEffect, useRef } from "react";
import {
  createQrPayment,
  getPaymentFilter,
} from "../../services/api/paymentService";
import { updateOrder } from "../../services/api/orderService";
import { getProductAccountByTransactionCode } from "../../services/api/productAccountService";
import { getCouponInfoByCouponCode } from "../../services/api/couponService";
import { toast } from "react-toastify";

const DEFAULT_COUNTDOWN = 120;
const CHECK_INTERVAL = 10000;

const PaymentModal = ({
  productOptionId,
  productName,
  amount,
  fee,
  total,
  onClose,
  onSuccess,
  /** Nhận email từ parent */
  customerEmail,
}) => {
  const [coupon, setCoupon] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(total);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [transactionCode, setTransactionCode] = useState("");
  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);

  const countdownRef = useRef(null);
  const pollRef = useRef(null);

  const [couponLoading, setCouponLoading] = useState(false);

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  const canPay = validateEmail(customerEmail);

  // Tính lại tổng tiền khi coupon thay đổi
  useEffect(() => {
    let discountAmount = 0;
    if (couponData?.isActive && couponData?.discountPercent > 0) {
      discountAmount = Math.round(amount * (couponData.discountPercent / 100));
    }
    setDiscount(discountAmount);
    setFinalTotal(Math.max(0, amount + fee - discountAmount));
  }, [couponData, amount, fee]);

  const handleApplyCoupon = async () => {
    const code = coupon.trim();
    if (!code || couponLoading) return;
    try {
      setCouponLoading(true);
      const res = await getCouponInfoByCouponCode(code);
      const data = res?.data;
      if (!data?.isActive || !data?.discountPercent) {
        setCouponData(null);
        toast.warn("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        return;
      }
      setCouponData(data);
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (err) {
      console.error("Lỗi khi áp dụng mã giảm giá:", err);
      toast.error("Không thể áp dụng mã giảm giá. Vui lòng thử lại sau.");
    } finally {
      setCouponLoading(false);
    }
  };

  const clearCoupon = () => {
    setCoupon("");
    setCouponData(null);
    setDiscount(0);
  };

  // Polling + countdown khi đã có transactionCode
  useEffect(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (pollRef.current) clearInterval(pollRef.current);

    if (!transactionCode || !showPaymentInfo) return;

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          if (pollRef.current) clearInterval(pollRef.current);
          toast.warn("⏰ Hết thời gian thanh toán.");
          onClose?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    pollRef.current = setInterval(async () => {
      try {
        const res = await getPaymentFilter(transactionCode);
        const data = Array.isArray(res?.data) ? res.data[0] : res.data;

        if (data?.status === 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          if (pollRef.current) clearInterval(pollRef.current);

          const productAccountData = await getProductAccountByTransactionCode(
            data.transactionCode
          );
          const orderResult = {
            paymentTransactionCode: transactionCode,
            productName,
            productAccountData: productAccountData?.data?.accountData,
            couponCode: couponData?.couponCode || null,
          };

          onClose?.();
          onSuccess?.(orderResult);
        }
      } catch {
        toast.warn("Lỗi khi kiểm tra trạng thái thanh toán.");
      }
    }, CHECK_INTERVAL);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [
    transactionCode,
    showPaymentInfo,
    onClose,
    onSuccess,
    productName,
    couponData,
  ]);

  const handleProceedPayment = async () => {
    if (!canPay) {
      toast.error("Vui lòng nhập email hợp lệ trước khi thanh toán.");
      return;
    }
    try {
      const response = await createQrPayment(productOptionId, finalTotal);
      const { qrCode, transactionCode: trxCode } = response?.data || {};
      if (qrCode && trxCode) {
        setQrImage(qrCode);
        setTransactionCode(trxCode);
        setCountdown(DEFAULT_COUNTDOWN);
        setShowPaymentInfo(true);
        await updateOrder(trxCode, { contactInfo: customerEmail });
      } else {
        toast.error("Không nhận được mã QR từ hệ thống.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo QR thanh toán:", error);
      toast.warn("Không thể tạo mã QR thanh toán.");
    }
  };

  // Reset couponData khi gõ mã khác
  useEffect(() => {
    setCouponData(null);
  }, [coupon]);

  return (
    <div className="max-w-xl w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 mx-auto space-y-6 max-h-screen overflow-y-auto">
      {/* Email + Coupon */}
      {/* Email + Coupon (trên/dưới) */}
      <div className="flex flex-col gap-6">
        {/* Email */}
        <div className="border rounded-md p-3 bg-gray-50 flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0"
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

          <div className="flex-1">
            {/* email + trạng thái ngang hàng */}
            <div className="flex items-center gap-3">
              <div className="font-medium text-gray-900">
                {customerEmail || "— Chưa có email —"}
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded border ${
                  !canPay
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-green-100 text-green-700 border-green-200"
                }`}
              >
                {canPay ? "Email hợp lệ" : "Email không hợp lệ"}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Hóa đơn sẽ gửi về email này. Vui lòng kiểm tra kĩ trước khi thanh
              toán.
            </p>
          </div>
        </div>

        {/* Coupon */}
        <div>
          <label
            htmlFor="coupon"
            className="text-sm font-semibold text-gray-800 mb-2 block"
          >
            Mã giảm giá
          </label>
          <div className="flex gap-2">
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              placeholder="Nhập mã (vd: SAVE10)"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
            {couponData ? (
              <button
                type="button"
                onClick={clearCoupon}
                className="px-4 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 whitespace-nowrap"
              >
                Gỡ mã
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={!coupon.trim() || couponLoading}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white whitespace-nowrap
            ${
              !coupon.trim() || couponLoading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
              >
                {couponLoading ? "Đang áp dụng..." : "Áp dụng"}
              </button>
            )}
          </div>

          {/* Trạng thái coupon + số tiền giảm (nếu có) */}

          {discount > 0 && (
            <span className="mt-1 block text-green-600 text-sm font-medium">
              Đã giảm {discount.toLocaleString("vi-VN")}₫
            </span>
          )}
        </div>
      </div>

      {/* Thông tin thanh toán */}
      <div className="bg-gray-50 p-4 rounded-md border space-y-3 text-sm text-gray-800">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            {productName}
          </h2>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Giá sản phẩm:</span>
          <span className="font-semibold text-black">
            {amount.toLocaleString("vi-VN")}₫
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="font-medium">
              Giảm giá ({couponData?.discountPercent}%):
            </span>
            <span className="font-semibold text-green-600">
              -{discount.toLocaleString("vi-VN")}₫
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-medium">Phí giao dịch:</span>
          <span className="font-semibold text-black">
            {fee.toLocaleString("vi-VN")}₫
          </span>
        </div>
        <div className="border-t pt-3 flex justify-between text-base font-semibold">
          <span>Tổng thanh toán:</span>
          <span className="text-green-600 text-lg font-bold">
            {finalTotal.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={handleProceedPayment}
          disabled={!canPay}
          className={`mt-4 px-6 py-2 rounded-md font-medium text-sm
            ${
              canPay
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Tiến hành thanh toán
        </button>
      </div>

      {showPaymentInfo && (
        <div className="flex flex-col gap-6 mt-6 md:flex-row md:items-start md:justify-center">
          <div className="flex flex-col w-full max-w-[280px] mx-auto md:mx-0 md:w-56 border rounded-lg overflow-hidden flex-shrink-0 items-center">
            <img
              src={qrImage}
              alt="QR code"
              className="w-full h-full object-contain"
            />
            <div className="text-center text-xs text-gray-600 mt-2">
              Mã QR sẽ hết hạn sau{" "}
              <span className="text-red-500 font-semibold">{countdown}s</span>.
            </div>
          </div>

          <div className="text-sm text-gray-700 leading-relaxed w-full">
            <p className="font-semibold text-base mb-2 text-center md:text-left">
              Thực hiện theo hướng dẫn sau để thanh toán tự động:
            </p>
            <ol className="space-y-1 list-decimal pl-5 mb-4">
              <li>
                Mở ứng dụng <strong>Mobile Banking</strong> của ngân hàng
              </li>
              <li>
                Chọn <strong>Thanh Toán</strong> và quét mã QR bên trái
              </li>
              <li>Chờ 10–20s để hệ thống xác nhận</li>
            </ol>
            <p className="text-red-600 text-sm font-medium text-center md:text-left">
              ⚠ Nếu sau 1 phút thanh toán nhưng không thành công, vui lòng liên
              hệ Zalo: <strong>0344665098</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentModal;

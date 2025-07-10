import React, { useState, useEffect } from "react";
import { createQrPayment } from "../../services/api/paymentService";
import { updateOrder } from "../../services/api/orderService";
import { getPaymentFilter } from "../../services/api/paymentService";
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
}) => {
  const [email, setEmail] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [finalTotal, setFinalTotal] = useState(total);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [transactionCode, setTransactionCode] = useState("");
  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);

  // Tính lại tổng tiền khi coupon hoặc dữ liệu liên quan thay đổi
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
    if (!code) return;

    try {
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
    }
  };

  useEffect(() => {
    if (!transactionCode || !showPaymentInfo) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          clearInterval(pollingInterval);
          toast.warn("⏰ Hết thời gian thanh toán.");
          setTimeout(() => {
            if (onClose) onClose();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const pollingInterval = setInterval(async () => {
      try {
        const res = await getPaymentFilter(transactionCode);
        const data = Array.isArray(res?.data) ? res.data[0] : res.data;

        if (data?.status === 1) {
          clearInterval(countdownInterval);
          clearInterval(pollingInterval);
          const productAccountData = await getProductAccountByTransactionCode(
            data.transactionCode
          );
          const orderResult = {
            paymentTransactionCode: transactionCode,
            productName,
            productAccountData: productAccountData.data.accountData,
            couponCode: couponData?.couponCode || null, // 👈 THÊM DÒNG NÀY

          };
          setTimeout(() => {
            if (onClose) onClose();
            if (onSuccess) onSuccess(orderResult);
          }, 0);
        }
      } catch (error) {
        toast.warn("Lỗi khi kiểm tra trạng thái thanh toán.");
      }
    }, CHECK_INTERVAL);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(pollingInterval);
    };
  }, [transactionCode, showPaymentInfo]);

  const handleProceedPayment = async () => {
    if (!email || !email.includes("@")) {
      alert("Vui lòng nhập email hợp lệ để tiếp tục.");
      return;
    }

    try {
      const response = await createQrPayment(productOptionId, finalTotal);
      const { qrCode, transactionCode: trxCode } = response.data || {};

      if (qrCode && trxCode) {
        setQrImage(qrCode);
        setTransactionCode(trxCode);
        setShowPaymentInfo(true);
        await updateOrder(trxCode, { contactInfo: email });
      } else {
        alert("Không nhận được mã QR từ hệ thống.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo QR thanh toán:", error);
      toast.warn("Không thể tạo mã QR thanh toán.");
    }
  };

  // Reset khi người dùng nhập mã mới
  useEffect(() => {
    setCouponData(null);
  }, [coupon]);

  return (
    <div className="max-w-xl w-full bg-white rounded-xl shadow-md border border-gray-200 p-6 mx-auto space-y-6 max-h-screen overflow-y-auto">
      {/* Email + Coupon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm text-gray-700 font-medium mb-1">
            Email nhận hóa đơn <span className="text-red-500">*</span>:
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập địa chỉ email"
            className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="coupon" className="text-sm text-gray-700 font-medium mb-1">
            Mã giảm giá:
          </label>
          <div className="flex gap-1">
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
              placeholder="Nhập mã..."
              className="border rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md whitespace-nowrap"
            >
              Áp dụng
            </button>
          </div>
          {/* ✅ Hiển thị số tiền đã giảm nếu có */}
          {discount > 0 && (
            <span className="mt-1 text-green-600 text-sm font-medium">
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
            <span className="font-medium">Giảm giá ({couponData?.discountPercent}%):</span>
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

      {!showPaymentInfo && (
        <p className="text-sm text-red-600 text-center">
          * Vui lòng nhập email trước khi thanh toán, shop sẽ gửi thông báo hỗ trợ qua email này.
        </p>
      )}

      <div className="text-center">
        <button
          onClick={handleProceedPayment}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium text-sm"
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
              <li>Mở ứng dụng <strong>Mobile Banking</strong> của ngân hàng</li>
              <li>Chọn <strong>"Thanh Toán"</strong> và quét mã QR bên trái</li>
              <li>Chờ 10-20s để hệ thống xác nhận</li>
            </ol>
            <p className="text-red-600 text-sm font-medium text-center md:text-left">
              ⚠ Nếu sau 1 phút thanh toán nhưng không thành công, vui lòng liên hệ Zalo: <strong>0344665098</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentModal;

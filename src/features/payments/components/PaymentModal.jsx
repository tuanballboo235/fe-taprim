import { useEffect, useMemo, useRef, useState } from "react";
import {
  createQrPayment,
  getPaymentFilter,
} from "@/features/payments/api/paymentService";
import { getProductAccountByTransactionCode } from "@/features/admin/productAccounts/api/productAccountService";
import { getCouponInfoByCouponCode } from "@/features/coupons/api/couponService";
import Button from "@/shared/components/Button";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const DEFAULT_COUNTDOWN = 120;
const CHECK_INTERVAL = 10000;

const formatCurrency = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const unwrapData = (response) => response?.data ?? response?.Data ?? null;

const PaymentModal = ({
  productOptionId,
  productName,
  amount,
  fee,
  quantity = 1,
  stockQuantity = 0,
  onClose,
  onSuccess,
  onTransactionChange,
  customerEmail,
}) => {
  const [coupon, setCoupon] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [transactionCode, setTransactionCode] = useState("");
  const [paymentSummary, setPaymentSummary] = useState(null);
  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const countdownRef = useRef(null);
  const pollRef = useRef(null);
  const hasExpiredRef = useRef(false);

  const canPay = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    (customerEmail || "").trim()
  );
  const selectedQuantity = Math.max(1, Number.parseInt(quantity, 10) || 1);
  const subtotal = Number(amount || 0) * selectedQuantity;

  const discount = useMemo(() => {
    if (couponData?.isActive && couponData?.discountPercent > 0) {
      return Math.round(subtotal * (couponData.discountPercent / 100));
    }

    return 0;
  }, [couponData, subtotal]);

  const finalTotal = Math.max(0, subtotal + Number(fee || 0) - discount);
  const displayOriginalAmount =
    paymentSummary?.originalAmount ?? paymentSummary?.OriginalAmount ?? subtotal;
  const displayTransactionFee =
    paymentSummary?.transactionFee ?? paymentSummary?.TransactionFee ?? fee;
  const displayDiscount =
    paymentSummary?.discountAmount ?? paymentSummary?.DiscountAmount ?? discount;
  const displayTotal =
    paymentSummary?.totalAmount ?? paymentSummary?.TotalAmount ?? finalTotal;

  const clearTimers = () => {
    clearInterval(countdownRef.current);
    clearInterval(pollRef.current);
  };

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code || couponLoading) return;

    try {
      setCouponLoading(true);
      const res = await getCouponInfoByCouponCode(code);
      const data = unwrapData(res);

      if (!data?.isActive || !data?.discountPercent) {
        setCouponData(null);
        notify.warning("Mã giảm giá không còn hiệu lực.");
        return;
      }

      setCoupon(code);
      setCouponData(data);
      notify.success("Áp dụng mã giảm giá thành công.");
    } catch (error) {
      setCouponData(null);
      notify.error(
        getApiErrorMessage(error, "Mã giảm giá đã hết hạn hoặc không còn hiệu lực.")
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const clearCoupon = () => {
    setCoupon("");
    setCouponData(null);
    setPaymentSummary(null);
  };

  const handleProceedPayment = async () => {
    if (!canPay) {
      notify.error("Vui lòng nhập email hợp lệ trước khi thanh toán.");
      return;
    }

    try {
      setPaymentLoading(true);
      const availableQuantity = Number(stockQuantity) || 0;

      if (availableQuantity < selectedQuantity) {
        notify.warning(
          availableQuantity <= 0
            ? "Sản phẩm đã hết hàng. Vui lòng liên hệ fanpage hoặc Zalo để được tư vấn."
            : `Chỉ còn ${availableQuantity} tài khoản khả dụng, vui lòng giảm số lượng.`
        );
        return;
      }

      const res = await createQrPayment({
        productOptionId,
        totalAmount: finalTotal,
        transactionFee: fee,
        quantity: selectedQuantity,
        emailOrder: customerEmail,
        couponCode: couponData?.couponCode || couponData?.CouponCode || null,
      });
      const data = unwrapData(res);
      const qrCode = data?.qrCode ?? data?.QrCode;
      const trxCode = data?.transactionCode ?? data?.TransactionCode;

      if (!qrCode || !trxCode) {
        notify.error("Không nhận được mã QR từ hệ thống.");
        return;
      }

      hasExpiredRef.current = false;
      setQrImage(qrCode);
      setTransactionCode(trxCode);
      setPaymentSummary(data);
      onTransactionChange?.(trxCode);
      setCountdown(DEFAULT_COUNTDOWN);
      setShowPaymentInfo(true);
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, "Không thể tạo mã QR thanh toán.")
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    clearTimers();

    if (!transactionCode || !showPaymentInfo) return undefined;

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearTimers();
          if (!hasExpiredRef.current) {
            notify.warning("Hết thời hạn thanh toán.");
            hasExpiredRef.current = true;
            onClose?.(transactionCode, true);
          }
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
          clearTimers();
          const acc = await getProductAccountByTransactionCode(
            data.transactionCode
          );

          notify.success("Thanh toán thành công.");
          onTransactionChange?.("");
          onClose?.(null, false);
          onSuccess?.({
            paymentTransactionCode: transactionCode,
            productName,
            productAccountData: acc?.data?.accountData,
            couponCode:
              paymentSummary?.couponCode ??
              paymentSummary?.CouponCode ??
              couponData?.couponCode ??
              null,
            couponDiscountPersent:
              paymentSummary?.couponDiscountPercent ??
              paymentSummary?.CouponDiscountPercent ??
              couponData?.discountPercent ??
              null,
            contactInfo: customerEmail || "",
            originalAmount: displayOriginalAmount,
            transactionFee: displayTransactionFee,
            discountAmount: displayDiscount,
            totalAmount: displayTotal,
            quantity: selectedQuantity,
            paidAt: new Date().toISOString(),
            createAt: new Date().toISOString(),
            expiredAt: null,
          });
        }
      } catch (error) {
        clearTimers();
        notify.error(
          getApiErrorMessage(error, "Lỗi khi kiểm tra trạng thái thanh toán.")
        );
        onClose?.(transactionCode, true);
      }
    }, CHECK_INTERVAL);

    return clearTimers;
  }, [
    couponData,
    customerEmail,
    displayDiscount,
    displayOriginalAmount,
    displayTotal,
    displayTransactionFee,
    onClose,
    onSuccess,
    onTransactionChange,
    paymentSummary,
    productName,
    selectedQuantity,
    showPaymentInfo,
    transactionCode,
  ]);

  return (
    <div className="mx-auto max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
            {productName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kiểm tra thông tin và tạo mã QR để thanh toán.
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                {customerEmail || "Chưa có email"}
              </p>
              <p className="text-xs text-slate-500">
                Hóa đơn và thông tin đơn hàng sẽ gửi về email này.
              </p>
            </div>
            <span
              className={[
                "w-fit rounded-full border px-2 py-1 text-xs font-medium",
                canPay
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700",
              ].join(" ")}
            >
              {canPay ? "Email hợp lệ" : "Email không hợp lệ"}
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="coupon"
            className="mb-2 block text-sm font-semibold text-slate-800"
          >
            Mã giảm giá
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="coupon"
              type="text"
              value={coupon}
              onChange={(event) => {
                setCoupon(event.target.value.toUpperCase());
                setCouponData(null);
                setPaymentSummary(null);
              }}
              onKeyDown={(event) =>
                event.key === "Enter" && handleApplyCoupon()
              }
              disabled={showPaymentInfo}
              placeholder="Nhập mã, ví dụ SAVE10"
              className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 disabled:bg-slate-50"
            />
            {couponData ? (
              <Button
                variant="muted"
                onClick={clearCoupon}
                disabled={showPaymentInfo}
              >
                Gỡ mã
              </Button>
            ) : (
              <Button
                variant="info"
                onClick={handleApplyCoupon}
                disabled={!coupon.trim() || showPaymentInfo}
                isLoading={couponLoading}
              >
                {couponLoading ? "Đang áp dụng..." : "Áp dụng"}
              </Button>
            )}
          </div>
          {displayDiscount > 0 && (
            <p className="mt-2 text-sm font-medium text-green-700">
              Đã giảm {formatCurrency(displayDiscount)}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
          <div className="flex justify-between gap-4">
            <span>Đơn giá</span>
            <strong>{formatCurrency(amount)}</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span>Số lượng</span>
            <strong>{selectedQuantity}</strong>
          </div>
          <div className="flex justify-between gap-4">
            <span>Giá gốc</span>
            <strong>{formatCurrency(displayOriginalAmount)}</strong>
          </div>
          {displayDiscount > 0 && (
            <div className="flex justify-between gap-4 text-green-700">
              <span>
                Giảm giá (
                {paymentSummary?.couponDiscountPercent ??
                  paymentSummary?.CouponDiscountPercent ??
                  couponData?.discountPercent}
                %)
              </span>
              <strong>-{formatCurrency(displayDiscount)}</strong>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span>Phí giao dịch</span>
            <strong>{formatCurrency(displayTransactionFee)}</strong>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-base">
            <span className="font-semibold">Tổng thanh toán</span>
            <strong className="text-green-700">
              {formatCurrency(displayTotal)}
            </strong>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleProceedPayment}
            disabled={!canPay || showPaymentInfo}
            isLoading={paymentLoading}
            className="w-full sm:w-auto"
          >
            {paymentLoading ? "Đang tạo mã QR..." : "Tiến hành thanh toán"}
          </Button>
        </div>

        {showPaymentInfo && (
          <div className="grid gap-5 rounded-lg border border-green-200 bg-green-50 p-4 md:grid-cols-[220px_1fr]">
            <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-lg border border-white bg-white">
              <img
                src={qrImage}
                alt="QR code"
                className="w-full object-contain"
              />
            </div>

            <div className="text-sm text-slate-700">
              <p className="font-semibold text-slate-900">
                Hướng dẫn thanh toán
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5">
                <li>Mở ứng dụng Mobile Banking.</li>
                <li>Chọn thanh toán và quét mã QR.</li>
                <li>Chờ 10-20 giây để hệ thống xác nhận.</li>
              </ol>
              <p className="mt-3 text-red-600">
                Mã QR hết hạn sau <strong>{countdown}s</strong>. Nếu đã thanh
                toán nhưng chưa nhận đơn, vui lòng liên hệ Zalo 0344665098.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;

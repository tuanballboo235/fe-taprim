import { useEffect, useMemo, useRef, useState } from "react";
import {
  createQrPayment,
  getPaymentFilter,
} from "@/features/payments/api/paymentService";
import { updateOrder } from "@/features/orders/api/orderService";
import {
  getProductAccountByTransactionCode,
  getProductAccountFilter,
} from "@/features/admin/productAccounts/api/productAccountService";
import { getCouponInfoByCouponCode } from "@/features/coupons/api/couponService";
import Button from "@/shared/components/Button";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import notify from "@/shared/utils/notify";

const DEFAULT_COUNTDOWN = 120;
const CHECK_INTERVAL = 10000;

const formatCurrency = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const PaymentModal = ({
  productOptionId,
  productName,
  amount,
  fee,
  total,
  onClose,
  onSuccess,
  customerEmail,
}) => {
  const [coupon, setCoupon] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [transactionCode, setTransactionCode] = useState("");
  const [countdown, setCountdown] = useState(DEFAULT_COUNTDOWN);
  const [couponLoading, setCouponLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const countdownRef = useRef(null);
  const pollRef = useRef(null);
  const hasExpiredRef = useRef(false);

  const canPay = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    (customerEmail || "").trim(),
  );

  const discount = useMemo(() => {
    if (couponData?.isActive && couponData?.discountPercent > 0) {
      return Math.round(amount * (couponData.discountPercent / 100));
    }

    return 0;
  }, [amount, couponData]);

  const finalTotal = Math.max(0, total - discount);

  const clearTimers = () => {
    clearInterval(countdownRef.current);
    clearInterval(pollRef.current);
  };

  const handleApplyCoupon = async () => {
    const code = coupon.trim();
    if (!code || couponLoading) return;

    try {
      setCouponLoading(true);
      const res = await getCouponInfoByCouponCode(code);
      const data = res?.data;

      if (!data?.isActive || !data?.discountPercent) {
        setCouponData(null);
        notify.warning("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
        return;
      }

      setCouponData(data);
      notify.success("Áp dụng mã giảm giá thành công.");
    } catch (error) {
      notify.error(getApiErrorMessage(error, "Không thể áp dụng mã giảm giá."));
    } finally {
      setCouponLoading(false);
    }
  };

  const clearCoupon = () => {
    setCoupon("");
    setCouponData(null);
  };

  const handleProceedPayment = async () => {
    if (!canPay) {
      notify.error("Vui lòng nhập email hợp lệ trước khi thanh toán.");
      return;
    }

    try {
      setPaymentLoading(true);
      const check = await getProductAccountFilter({
        productOptionId,
        canSell: true,
      });

      if (check?.data?.items?.length === 0) {
        notify.warning(
          "Sản phẩm đã hết hàng. Vui lòng liên hệ fanpage hoặc Zalo để được tư vấn.",
        );
        return;
      }

      const res = await createQrPayment(productOptionId, finalTotal);
      const { qrCode, transactionCode: trxCode } = res?.data || {};

      if (!qrCode || !trxCode) {
        notify.error("Không nhận được mã QR từ hệ thống.");
        return;
      }

      setQrImage(qrCode);
      setTransactionCode(trxCode);
      setCountdown(DEFAULT_COUNTDOWN);
      setShowPaymentInfo(true);
      await updateOrder(trxCode, { contactInfo: customerEmail });
    } catch (error) {
      notify.error(
        getApiErrorMessage(error, "Không thể tạo mã QR thanh toán."),
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    setCouponData(null);
  }, [coupon]);

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
            onClose?.();
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
            data.transactionCode,
          );

          notify.success("Thanh toán thành công.");
          onClose?.();
          onSuccess?.({
            paymentTransactionCode: transactionCode,
            productName,
            productAccountData: acc?.data?.accountData,
            couponCode: couponData?.couponCode || null,
            contactInfo: customerEmail || "",
            totalAmount: finalTotal,
            paidAt: new Date().toISOString(),
            createAt: new Date().toISOString(),
            expiredAt: null,
          });
        }
      } catch (error) {
        clearTimers();
        notify.error(
          getApiErrorMessage(error, "Lỗi khi kiểm tra trạng thái thanh toán."),
        );
        onClose?.();
      }
    }, CHECK_INTERVAL);

    return clearTimers;
  }, [
    couponData,
    customerEmail,
    finalTotal,
    onClose,
    onSuccess,
    productName,
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
                Hóa đơn và thông tin đơn hàng sẽ gửi về email này{" "}
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
              onChange={(e) => setCoupon(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
              placeholder="Nhập mã, ví dụ SAVE10"
              className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
            {couponData ? (
              <Button variant="muted" onClick={clearCoupon}>
                Gỡ mã{" "}
              </Button>
            ) : (
              <Button
                variant="info"
                onClick={handleApplyCoupon}
                disabled={!coupon.trim()}
                isLoading={couponLoading}
              >
                {couponLoading ? "Đang áp dụng..." : "Áp dụng"}
              </Button>
            )}
          </div>
          {discount > 0 && (
            <p className="mt-2 text-sm font-medium text-green-700">
              Đã giảm {formatCurrency(discount)}
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
          <div className="flex justify-between gap-4">
            <span>Giá sản phẩm</span>
            <strong>{formatCurrency(amount)}</strong>
          </div>
          {discount > 0 && (
            <div className="flex justify-between gap-4 text-green-700">
              <span>Giảm giá ({couponData?.discountPercent}%)</span>
              <strong>-{formatCurrency(discount)}</strong>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span>Phí giao dịch</span>
            <strong>{formatCurrency(fee)}</strong>
          </div>
          <div className="flex justify-between gap-4 border-t border-slate-200 pt-3 text-base">
            <span className="font-semibold">Tổng thanh toán</span>
            <strong className="text-green-700">
              {formatCurrency(finalTotal)}
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
